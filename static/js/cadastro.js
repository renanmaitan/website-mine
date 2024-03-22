function sairCampo(s, a){
    const campo = document.getElementById(s)
    valido = true
    if (campo.value == ""){
        const caixa = document.getElementById(s)
        caixa.style.borderColor = "red"
        caixa.style.borderWidth = "2px"
        alerta = document.getElementById(a)
        alerta.style.color = "red"
        alerta.innerHTML = `* Esse campo é obrigatório!`
        return
    }
    if (s == "email"){
        valido = validarEmail(campo.value)
        verificarEmail(campo.value, s, a)
    }
    else if (s == "user"){
        valido = true
        const nome = campo.value
        verificarNomeUsuario(nome, s, a)
    }
    if (!valido){
        const caixa = document.getElementById(s)
        caixa.style.borderColor = "red"
        caixa.style.borderWidth = "2px"
        let str = s.charAt(0).toUpperCase() + s.slice(1);
        document.getElementById(a).innerHTML = `* ${str} inválido!`
    }
}

async function verificarEmail(email, s, a) {
    const url = `/email/${email}`;
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response.ok) {
            const emailExists = await response.text();
            const jsonObject = JSON.parse(emailExists);
            if (jsonObject.emailExists) {
                const caixa = document.getElementById(s);
                caixa.style.borderColor = "red";
                caixa.style.borderWidth = "2px";
                document.getElementById(a).innerHTML = `* Esse email já está cadastrado!`;
                document.getElementById(a).style.color = "red";
                return false;
            } else {
                return true;
            }
        } else {
            throw new Error("Erro ao enviar dados");
        }
    } catch (error) {
        console.log(error.message);
    }
}

async function verificarNomeUsuario(nome, s, a) {
    const url = `/usuario/${nome}`;
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response.ok) {
            const userExists = await response.text();
            const jsonObject = JSON.parse(userExists);
            if (jsonObject.userExists) {
                const caixa = document.getElementById(s);
                caixa.style.borderColor = "red";
                caixa.style.borderWidth = "2px";
                document.getElementById(a).innerHTML = `* Esse nome de usuário já existe! Escolha outro`;
                document.getElementById(a).style.color = "red";
                return false;
            } else {
                const caixa = document.getElementById(s);
                caixa.style.borderColor = "green";
                caixa.style.borderWidth = "2px";
                document.getElementById(a).innerHTML = `* Nome de usuário válido!`;
                document.getElementById(a).style.color = "green";
                return true;
            }
        } else {
            throw new Error("Erro ao enviar dados");
        }
    } catch (error) {
        console.log(error.message);
    }
}

function entrarCampo(s, a){
    const campo = document.getElementById(s)
    const alert = document.getElementById(a)
    alert.innerHTML = ""
    campo.style.borderWidth = "0"
}

function sairCampoCad(){
    let senha = document.getElementById("password").value
    let senhaConfirm = document.getElementById("passwordConfirm").value
    if (senha != senhaConfirm){
        const caixa = document.getElementById("passwordConfirm")
        caixa.style.borderColor = "red"
        caixa.style.borderWidth = "2px"
        document.getElementById("alertSenhaConfirm").innerHTML = "* As senhas não coincidem!"
    }
}

function validarEmail(email) {
    let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function cadastrar(user, nome, email, senha){
    const url = "/usuario";
    let data = {"user": user, "nome": nome, "email": email, "senha": senha};
    fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function(response){
        if (response.ok){
            return response.text();
        }
        else{
            throw new Error("Erro ao enviar dados");
        }
    }).then(function(statusCode){
        statusCode = JSON.parse(statusCode)
        if (statusCode.statusCode == 200){
            document.getElementById("tituloCadastro").innerHTML = "Cadastro realizado com sucesso!"
            document.getElementById("tituloCadastro").style.color = "green"
            document.getElementById("user").value = ""
            document.getElementById("nome").value = ""
            document.getElementById("email").value = ""
            document.getElementById("password").value = ""
            document.getElementById("passwordConfirm").value = ""
            document.getElementById("alertUser").innerHTML = ""
            document.getElementById("user").style.borderWidth = "0"
            document.getElementById("formLogin").style.display = "None"
            document.getElementById("loginLink").style.display = "block"
            hideLoading()
        }else{
            document.getElementById("alertCadastro").innerHTML = "Erro ao cadastrar usuário!"
            hideLoading()
        }
    })
    .catch(function(error){
        console.log(error.message)
        hideLoading()
    })
}

async function cadastrarUser() {
    showLoading();
    const user = document.getElementById("user").value;
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("password").value;
    const senhaConfirm = document.getElementById("passwordConfirm").value;

    if (senha === "" || senhaConfirm === "" || user === "" || nome === "" || email === "") {
        document.getElementById("alertCadastro").innerHTML = "Preencha todos os campos!";
        document.getElementById("alertCadastro").style.color = "red";
        sairCampo("email", "alertEmail");
        sairCampo("user", "alertUser");
        sairCampo("nome", "alertNome");
        sairCampoCad();
        hideLoading();
    } else {
        const validarEmailResult = validarEmail(email);
        const verificarEmailResult = await verificarEmail(email, "email", "alertEmail");
        const verificarNomeUsuarioResult = await verificarNomeUsuario(user, "user", "alertUser");
        if (validarEmailResult && verificarEmailResult && verificarNomeUsuarioResult && senha === senhaConfirm) {
            cadastrar(user, nome, email, senha);
            document.getElementById("alertCadastro").innerHTML = ""
        } else {
            document.getElementById("alertCadastro").innerHTML = "Preencha os campos corretamente!";
            document.getElementById("alertCadastro").style.color = "red";
            sairCampo("email", "alertEmail");
            sairCampo("user", "alertUser");
            sairCampo("nome", "alertNome");
            sairCampoCad();
            hideLoading();
        }
    }
}

const campo = document.getElementById("passwordConfirm")
campo.addEventListener("blur", sairCampoCad)
campo.addEventListener("focus", function(){entrarCampo("passwordConfirm", "alertSenhaConfirm")})
const senha = document.getElementById("password")
senha.addEventListener("blur", sairCampoCad)
senha.addEventListener("focus", function(){entrarCampo("passwordConfirm", "alertSenhaConfirm")})
document.getElementById("email").addEventListener("blur", function(){sairCampo("email", "alertEmail")})
document.getElementById("email").addEventListener("focus", function(){entrarCampo("email", "alertEmail")})
document.getElementById("user").addEventListener("blur", function(){sairCampo("user", "alertUser")})
document.getElementById("user").addEventListener("focus", function(){entrarCampo("user", "alertUser")})
document.getElementById("nome").addEventListener("blur", function(){sairCampo("nome", "alertNome")})
document.getElementById("nome").addEventListener("focus", function(){entrarCampo("nome", "alertNome")})
