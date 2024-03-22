from flask import jsonify
import requests
import mysql.connector
import secrets
import string
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import bcrypt

def enviarEmail(endEmail, token):
    corpo_email = """
    <p>Olá,</p>
    <p>Seu token de ativação do VIP é: <b>{}</b></p>
    <p>Para ativar seu VIP, digite o comando a seguir no chat do Servidor:<br><b>/ativarvip {}</b></p>
    <p>Atenciosamente,<br>RegnaCraft</p>
    """.format(token, token)

    msg = MIMEMultipart()
    msg['Subject'] = 'Token de ativação de VIP'
    msg['From'] = 'noreply.regnacraft@gmail.com'
    msg['To'] = endEmail

    # Adicionar o corpo do e-mail como um objeto MIMEText ao MIMEMultipart
    corpo_mime = MIMEText(corpo_email, 'html')
    msg.attach(corpo_mime)

    password = "prrxfwopnxbzsfuk"

    # Enviar o e-mail
    with smtplib.SMTP('smtp.gmail.com', 587) as s:
        s.starttls()
        s.login(msg['From'], password)
        s.sendmail(msg['From'], [msg['To']], msg.as_string())

def generate_token(length=20):
    allowed_chars = string.ascii_letters + string.digits
    token = ''.join(secrets.choice(allowed_chars) for _ in range(length))
    return token


def get_db_connection():
    config = {
        'user': 'sql10683680',
        'password': 'l4RiqHuqxl',
        'host': 'sql10.freesqldatabase.com',
        'port': '3306',
        'database': 'sql10683680',
        'raise_on_warnings': True,
    }
    return mysql.connector.connect(**config)

def close_db_connection(connection):
    connection.close()

def execute_query(query, values=None):
    connection = get_db_connection()
    cursor = connection.cursor()
    if values:
        cursor.execute(query, values)
    else:
        cursor.execute(query)
    result = cursor.fetchall()
    connection.commit()
    cursor.close()
    close_db_connection(connection)
    return result

def enviarEmailRecuperacao(endEmail, user, senha):
    corpo_email = """
    <p>Olá,</p>
    <p>Seu nome de usuário é: <b>{}</b></p>
    <p>Sua senha é: <b>{}</b></p>
    <p>Atenciosamente,<br>RegnaCraft</p>
    """.format(user, senha)

    msg = MIMEMultipart()
    msg['Subject'] = 'Seus dados de acesso ao site RegnaCraft'
    msg['From'] = 'noreply.regnacraft@gmail.com'
    msg['To'] = endEmail

    # Adicionar o corpo do e-mail como um objeto MIMEText ao MIMEMultipart
    corpo_mime = MIMEText(corpo_email, 'html')
    msg.attach(corpo_mime)

    password = "prrxfwopnxbzsfuk"

    # Enviar o e-mail
    with smtplib.SMTP('smtp.gmail.com', 587) as s:
        s.starttls()
        s.login(msg['From'], password)
        s.sendmail(msg['From'], [msg['To']], msg.as_string())

def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password, hashed_password):
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

def getPriceCodeByPlan(plan):
    plan = int(plan)
    if plan == 1: 
        price_id = "price_1NVolUDb7qHdITRqHxZ1SUl1"
    elif plan == 2: 
        price_id = "price_1NX45wDb7qHdITRqvf19b7Xf"
    elif plan == 3: 
        price_id = "price_1NX467Db7qHdITRqF5p1Swtz"
    elif plan == 4:
        price_id = "price_1NX46FDb7qHdITRqnICECkve"
    elif plan == 5:
        price_id = "price_1NX46NDb7qHdITRqUC6iNwEA"
    elif plan == 6:
        price_id = "price_1NX46UDb7qHdITRqtYbVKCWY"
    elif plan == 7:
        price_id = "price_1NX46aDb7qHdITRqMEzbAqut"
    elif plan == 8:
        price_id = "price_1NX46iDb7qHdITRqcCPjcW9p"
    elif plan == 9:
        price_id = "price_1NX46nDb7qHdITRq9x22b4kf"
    elif plan == 10:
        price_id = "price_1NX46tDb7qHdITRqQiLJtDMw"
    elif plan == 11:
        price_id = "price_1NX46zDb7qHdITRq5gohZYuE"
    elif plan == 12:
        price_id = "price_1NX474Db7qHdITRqISL6w9uy"
    else:
        return jsonify(error="Plano não encontrado"), 403
    return price_id