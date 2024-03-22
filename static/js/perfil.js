showLoading();

async function get_user_data(){
    const url = "/get_user_data";

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        return await response.json();
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error; // Re-throw the error to handle it further if needed
    }
}

async function getPlanoModelById(id) {
    const url = "/plano/"+id;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const plano = await response.json();
        return plano;
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error; // Re-throw the error to handle it further if needed
    }
}

async function getPlanoById(id) {
    const url = `/planos/${id}`;
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const plano = await response.json();
        return plano;
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error; // Re-throw the error to handle it further if needed
    }
}

document.getElementById("perfil").classList.add("active");
const nick = document.getElementById("nick");
const vip = document.getElementById("vip");
const diasrestantes = document.getElementById("diasrestantes");
const nextdiario = document.getElementById("nextdiario");
const nextsemanal = document.getElementById("nextsemanal");
const nextmensal = document.getElementById("nextmensal");
const adquirirvip = document.getElementById("adquirirvip");

get_user_data().then(data => {
    console.log(data)
    nick.innerHTML = data.name.split(" ")[0];
    let plano = data.plano;
    console.log(plano);
    if(!plano.planoExists){
        vip.innerHTML = "Você ainda não possui VIP";
        diasrestantes.innerHTML = "0 dias restantes";
        nextdiario.innerHTML = "indisponível";
        nextsemanal.innerHTML = "indisponível";
        nextmensal.innerHTML = "indisponível";
        hideLoading();
    }
    else{
        getPlanoById(plano).then(plano => {
            let dataBanco = new Date(plano.plano.dataInicio);
            let dataAtual = new Date();
            console.log(dataBanco);
            console.log(dataAtual);
            let diferenca = dataAtual.getTime() - dataBanco.getTime();
            let dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
            getPlanoModelById(plano.plano.planoId).then(planoModel => {
                vip.innerHTML = "VIP "+planoModel.plano.vip;
                let restam = planoModel.plano.dias-dias
                if (restam < 0) {
                    restam = 0;
                }
                diasrestantes.innerHTML =restam +" dias restantes";
                hideLoading();
            });
        });
    }
});
