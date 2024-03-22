import mysql.connector
from flask import Flask, render_template, make_response, jsonify, request, redirect, session, url_for
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from utils import *
import json
from user import User
from functools import wraps
import stripe

app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False
app.config['SECRET_KEY'] = '@Ram99845'
app.config['LOGIN_REDIRECT_VIEW'] = ''
app.config['SESSION_COOKIE_HTTPONLY'] = False

app.config['STRIPE_PUBLIC_KEY'] = 'pk_test_51NVPdUDb7qHdITRqdo0CxKwqn5TLcugp8NNHHnizZ0VQ1Fw5qaBOTdn9wQhP8TpdX9EGnhEOHec3kOZPNPIzVA2100OjXSmPzI'
app.config['STRIPE_SECRET_KEY'] = 'sk_test_51NVPdUDb7qHdITRqCSYtB6CTGmQpKuIw3fHezskLZWFuoQpIMBpR3ezdJDEUSHXU2p137wJkApxSPX0bfZlRBBRL00R25AqsgH'
app.config['ENDPOINT_SECRET'] = 'whsec_4a9962cade9d1e62378fb09752daaad4107a9147acb670ff5af73e1108084c10'

# app.config['STRIPE_PUBLIC_KEY'] = 'pk_live_51NVPdUDb7qHdITRqd3xTpjcXGO5A1p0Z7qZtiI8unFPF7ODwqWHuikKZCpgXaldVoOCpock1NxRYhQPzd4xWtxFT00c0PfSmMU'
# app.config['STRIPE_SECRET_KEY'] = 'secret'
# app.config['ENDPOINT_SECRET'] = 'whsec_0HyjK3tuHvO9iobVo1HPo9pkAeUEdwNx'

stripe.api_key = app.config['STRIPE_SECRET_KEY']

login_manager = LoginManager()
login_manager.init_app(app)

@app.route("/webhook", methods=["POST"])
def stripe_webhook():
    payload = request.get_data(as_text=True)
    sig_header = request.headers.get("Stripe-Signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, app.config['ENDPOINT_SECRET']
        )

    except ValueError as e:
        # Invalid payload
        return "Invalid payload", 400
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        return "Invalid signature", 400

    # Handle the checkout.session.completed event
    if event["type"] == "checkout.session.completed":
        email = event["data"]["object"]["customer_details"]["email"]
        plano = event["data"]["object"]["metadata"]["plano"]
        token = generate_token()
        query = f"INSERT INTO tokens (token, plano) VALUES ('{token}', '{plano}')"
        execute_query(query)
        enviarEmail(email, token)

    return "Success", 200

@app.route("/config")
def get_publishable_key():
    stripe_config = {"publicKey": app.config['STRIPE_PUBLIC_KEY']}
    return jsonify(stripe_config)

@app.route("/create-checkout-session", methods=["POST"])
def create_checkout_session():
    data = request.json
    plano = data.get("plano")
    price_id = getPriceCodeByPlan(plano)
    
    domain_url = "https://regnacraft.onrender.com/"
    stripe.api_key = app.config['STRIPE_SECRET_KEY']

    metadata = {
        "plano": plano
    }

    try:
        checkout_session = stripe.checkout.Session.create(
            line_items=[
                {
                    "price": price_id,
                    "quantity": 1
                }
            ],
            success_url=domain_url + "success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url=domain_url + "cancelled",
            payment_method_types=["card"],
            mode="payment",
            metadata=metadata
        )
        return jsonify({"sessionId": checkout_session["id"]})
    except Exception as e:
        return jsonify(error=str(e)), 403

@app.route('/success')
def success():
    return render_template('success.html')

@app.route('/cancelled')
def cancel():
    return render_template('cancel.html')

@login_manager.user_loader
def load_user(user_id):
    query = f"SELECT * FROM users WHERE id = {user_id}"
    myresult = execute_query(query)
    if myresult:
        myresult = myresult[0]
        user_id, username, name, email, nickname, senha, plano, group = myresult
        user = User(user_id, username, name, email, nickname, senha, plano, group)
        return user
    return None

@login_manager.unauthorized_handler
def unauthorized_callback():
    return redirect('/login')

def group_required(groups):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            if current_user.is_authenticated and current_user.group in groups:
                return func(*args, **kwargs)
            else:
                return jsonify({'error': 'Acesso não autorizado'}), 403
        return wrapper
    return decorator

@app.route('/plano/<string:id>', methods=['GET'])
def get_plano_model(id):
    query = f"SELECT * FROM plano WHERE id = {id}"
    myresult = execute_query(query)
    if len(myresult) == 0:
        return make_response(
            jsonify(
                titulo="Plano não encontrado!",
                planoExists=False
            )
        )
    else:
        for x in myresult:
            plano = {
                "id": x[0],
                "vip": x[1],
                "dias": x[2]
            }
        return make_response(
            jsonify(
                titulo="Plano encontrado!",
                planoExists=True,
                plano=plano
            )
        )

@app.route('/planos/<string:id>', methods=['GET'])
def get_plano(id):
    query = f"SELECT * FROM planos WHERE id = {id}"
    myresult = execute_query(query)
    if len(myresult) == 0:
        return make_response(
            jsonify(
                titulo="Plano não encontrado!",
                planoExists=False
            )
        )
    else:
        for x in myresult:
            plano = {
                "id": x[0],
                "planoId": x[1],
                "dataInicio": x[2]
            }
        return make_response(
            jsonify(
                titulo="Plano encontrado!",
                planoExists=True,
                plano=plano
            )
        )

@app.route('/planos', methods=['GET'])
@group_required(['admin'])
@login_required
def get_planos():
    query = "SELECT * FROM planos"
    myresult = execute_query(query)
    planos = []
    for x in myresult:
        plano = {
            "id": x[0],
            "vip": x[1],
            "dias": x[2]
        }
        planos.append(plano)
    return make_response(
            jsonify(
                titulo="Lista de planos",
                planos=planos
            )
        )

@app.route('/login', methods=['POST'])
def sign_in():
    data = request.json
    user = data.get('user')
    senha = data.get('senha')
    query = f"SELECT * FROM users WHERE user = '{user}'"
    myresult = execute_query(query)
    if myresult:
        myresult = myresult[0]
        user_id, username, name, email, nickname, password, plano, group = myresult
        #print(f"User: {user_id}, Username: {username}, Name: {name}, Email: {email}, Nick: {nickname}, Pass: {password}, Plano: {plano}, Grupo: {group}")
        if verify_password(senha, password):
            user = User(user_id, username, name, email, nickname, password, plano, group)
            login_user(user)
            
            resp = make_response(
                jsonify(
                    titulo="Usuário logado com sucesso!",
                    login=True,
                    usuario={
                        "user": username,
                        "group": group
                    }
                )
            )
            resp.set_cookie('user', username)
            resp.set_cookie('logged_in', 'true')
            return resp
        else:
            resp = make_response(
                jsonify(
                    titulo="Senha incorreta!",
                    login=False
                )
            )
            resp.set_cookie('logged_in', 'false')
            return resp
    else:
        resp = make_response(
            jsonify(
                titulo="Usuário incorreto!",
                login=False
            )
        )
        resp.set_cookie('logged_in', 'false')
        return resp

@app.route('/usuarios', methods=['GET'])
@group_required(['admin'])
@login_required
def get_usuarios():
    query = "SELECT * FROM users"
    myresult = execute_query(query)
    usuarios = []
    for x in myresult:
        usuario = {
            "id": x[0],
            "user": x[1],
            "nome": x[2],
            "email": x[3],
            "senha": x[4],
            "plano": x[5],
            "nickname": x[6],
            "group": x[7]
        }
        usuarios.append(usuario)
    return make_response(
            jsonify(
                titulo="Lista de usuários",
                usuarios=usuarios
            )
        )

@app.route('/deletarALLUSERS', methods=['GET'])
@group_required(['admin'])
@login_required
def deletarALLUSERS():
    query = "DELETE FROM users"
    execute_query(query)
    return make_response(
            jsonify(
                statusCode=200,
                titulo="Todos os usuários foram deletados!"
            )
        )

@app.route('/email/<string:email>', methods=['GET'])
def get_email(email):
    query = f"SELECT * FROM users WHERE email = '{email}'"
    myresult = execute_query(query)
    if len(myresult) == 0:
        return make_response(
            jsonify(
                titulo="Email não encontrado!",
                emailExists=False
            )
        )
    else:
        email = myresult[0][3]
        return make_response(
            jsonify(
                titulo="Email encontrado!",
                emailExists=True,
                email=email
            )
        )

@app.route('/email_admin/<string:email>', methods=['GET'])
@group_required(['admin'])
@login_required
def get_email_admin(email):
    query = f"SELECT * FROM users WHERE email = '{email}'"
    myresult = execute_query(query)
    if len(myresult) == 0:
        return make_response(
            jsonify(
                titulo="Email não encontrado!",
                emailExists=False
            )
        )
    else:
        for x in myresult:
            usuario = {
                "id": x[0],
                "user": x[1],
                "nome": x[2],
                "email": x[3],
                "senha": x[4],
                "plano": x[5],
                "nickname": x[6],
                "group": x[7]
            }
        return make_response(
            jsonify(
                titulo="Email encontrado!",
                emailExists=True,
                usuario=usuario
            )
        )

@app.route('/usuario/<string:user>', methods=['GET'])
def get_usuario(user):
    query = f"SELECT * FROM users WHERE user = '{user}'"
    myresult = execute_query(query)
    if len(myresult) == 0:
        return make_response(
            jsonify(
                titulo="Usuário não encontrado!",
                userExists=False
            )
        )
    else:
        for x in myresult:
            usuario = x[1]
        return make_response(
            jsonify(
                titulo="Usuário encontrado!",
                userExists=True,
                usuario=usuario
            )
        )
    
@app.route('/usuario_admin/<string:user>', methods=['GET'])
@group_required(['admin'])
@login_required
def get_usuario_admin(user):
    query = f"SELECT * FROM users WHERE user = '{user}'"
    myresult = execute_query(query)
    if len(myresult) == 0:
        return make_response(
            jsonify(
                titulo="Usuário não encontrado!",
                userExists=False
            )
        )
    else:
        for x in myresult:
            usuario = {
                "id": x[0],
                "user": x[1],
                "nome": x[2],
                "email": x[3],
                "senha": x[4],
                "plano": x[5],
                "nickname": x[6],
                "group": x[7]
            }
        return make_response(
            jsonify(
                titulo="Usuário encontrado!",
                userExists=True,
                usuario=usuario
            )
        )

@app.route('/logout')
@login_required
def logout():
    logout_user()
    resp = make_response(
        redirect(url_for('index'))
    )
    resp.set_cookie('logged_in', 'false')
    resp.set_cookie('user', '')
    
    return resp

@app.route('/usuario', methods=['POST'])
def post_usuario():
    data = request.json
    user = data.get('user')
    nome = data.get('nome')
    email = data.get('email')
    senha = hash_password(data.get('senha'))
    plano = data.get('plano')
    nickname = data.get('nickname')
    if plano is None:
        plano = 0
    if nickname is None:
        nickname = ""
    query = f"INSERT INTO users (user, nome, email, senha, plano, nickname) VALUES ('{user}', '{nome}', '{email}', '{senha}', {plano}, '{nickname}')"
    execute_query(query)
    return make_response(
            jsonify(
                statusCode=200,
                user=user,
                nome=nome,
                email=email,
                senha=senha,
                plano=plano,
                nickname=nickname,
            )
        )

@app.route('/forum')
def forum():
    return render_template('forum.html')

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.route('/cadastro')
def cadastro():
    return render_template('cadastro.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/store')
def store():
    return render_template('store.html')

@app.route('/solidus')
def solidus():
    vip_page = "solidus"
    return render_template('products/solidus.html', vip_page=vip_page)

@app.route('/denarius')
def denarius():
    vip_page = "denarius"
    return render_template('products/denarius.html', vip_page=vip_page)

@app.route('/obolus')
def obolus():
    vip_page = "obolus"
    return render_template('products/obolus.html', vip_page=vip_page)

@app.route('/perfil')
@login_required
def perfil():
    return render_template('perfil.html')

@app.route('/recuperarLogin')
def recuperarlogin():
    return render_template('recuperarlogin.html')

@app.route('/recuperarAcesso/<string:email_user>', methods=['GET'])
def recuperaracesso(email_user):
    query = f"SELECT * FROM users WHERE email = '{email_user}'"
    myresult = execute_query(query)
    if len(myresult) == 0:
        query = f"SELECT * FROM users WHERE user = '{email_user}'"
        myresult = execute_query(query)
        for x in myresult:
            email = x[3]
            senha = x[4]
        enviarEmailRecuperacao(email, email_user, senha)
        return make_response(
            jsonify(
                titulo="Usuário encontrado! Email enviado!",
                statusCode=200,
                email=email_user
            )
        )
    else:
        for x in myresult:
            user = x[1]
            senha = x[4]
        enviarEmailRecuperacao(email_user, user, senha)
        return make_response(
            jsonify(
                titulo="Email encontrado! Email enviado!",
                statusCode=200,
                email=email_user
            )
        )

@app.route('/get_user_data', methods=['GET'])
def get_user_data():
    safe_data_user = {
        "user": current_user.username,
        "name": current_user.name,
        "email": current_user.email,
        "nickname": current_user.nickname,
        "plano": current_user.plano,
        "group": current_user.group
    }
    return make_response(jsonify(safe_data_user))

@app.route('/quadrans')
def quadrans():
    vip_page = "quadrans"
    return render_template('products/quadrans.html', vip_page=vip_page)

@app.route('/solidus/kits')
def solidus_kits():
    return render_template('kits/solidusKit.html')

if __name__ == '__main__':
    app.run()