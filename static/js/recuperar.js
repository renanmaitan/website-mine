document.getElementById("btnRecuperar").addEventListener("click", recuperarSenha);
const email = document.getElementById("email")
const alerta = document.getElementById("alertRecuperarAcesso")

async function verificarNomeUsuario(nome) {
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
                return true;
            } else {
                return false;
            }
        } else {
            throw new Error("Erro ao enviar dados");
        }
    } catch (error) {
        console.log(error.message);
    }
}

async function verificarEmail(email) {
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
                return true;
            } else {
                return false;
            }
        } else {
            throw new Error("Erro ao enviar dados");
        }
    } catch (error) {
        console.log(error.message);
    }
}

async function recuperarSenha() {
    showLoading();
    email_user = email.value;
    if (email.value === "") {
      email.style.borderColor = "red";
      email.style.borderWidth = "2px";
      alerta.innerHTML = `* Preencha o campo!`;
      hideLoading();
    } else {
      try {
        const emailExists = await verificarEmail(email.value);
        const userExists = await verificarNomeUsuario(email.value);
  
        if (!emailExists && !userExists) {
          email.style.borderColor = "red";
          email.style.borderWidth = "2px";
          alerta.innerHTML = `* Email ou usuário inválido!`;
          alerta.style.color = "red";
          hideLoading();
        }else{
            const url = `/recuperarAcesso/${email_user}`;
            await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            alerta.innerHTML = `* Email enviado com sucesso!`;
            alerta.style.color = "green";
            email.style.borderColor = "green";
            email.style.borderWidth = "2px";
            hideLoading();
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  }