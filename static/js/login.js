document.getElementById("btnEntrar").addEventListener("click", entrar)

function entrar(){
    showLoading()
    const url = "/login"
    const user = document.getElementById("nome").value
    const senha = document.getElementById("password").value
    let data = {"user": user, "senha": senha}
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
    }).then(function(login){
        login = JSON.parse(login)
        if (login.login == true){
            window.location.href = "/"
            hideLoading()
        }else{
            document.getElementById("alertLogin").innerHTML = login.titulo
            hideLoading()
        }
    }).catch(function(error){
        console.log(error.message);
        hideLoading()
    })
}
