showLoading();

//desconto das compras
const solidus = 25
const denarius = 15
const obolus = 10
const quadrans = 5


//condado
const ganhaCondadoSolidus = true
const ganhaCondadoDenarius = true
const ganhaCondadoObolus = true
const ganhaCondadoQuadrans = false


//desconto dos impostos
const solidusI = 10
const denariusI = 5
const obolusI = 2
const quadransI = 0


//preços
const solidusMensal = "RS 60,00"
const solidusTrimestral = "RS 150,00"
const solidusAnual = "RS 480,00"

const denariusMensal = "RS 40,00"
const denariusTrimestral = "RS 100,00"
const denariusAnual = "RS 320,00"

const obolusMensal = "RS 25,00"
const obolusTrimestral = "RS 62,50"
const obolusAnual = "RS 200,00"

const quadransMensal = "RS 10,00"
const quadransTrimestral = "RS 25,00"
const quadransAnual = "RS 80,00"



function desconto(s){
    const pai = document.getElementById("beneficios")
    const e = document.getElementById("desconto")
    e.innerHTML = "<strong>•</strong> Desconto de "
    if(s == "solidus"){
        e.innerHTML += solidus
        if (solidus <= 0){
            pai.removeChild(e)
        }
    }else if(s == "denarius"){
        e.innerHTML += denarius
        if (denarius <= 0){
            pai.removeChild(e)
        }
    }else if(s == "obolus"){
        e.innerHTML += obolus
        if (obolus <= 0){
            pai.removeChild(e)
        }
    }else if(s == "quadrans"){
        e.innerHTML += quadrans
        if (quadrans <= 0){
            pai.removeChild(e)
        }
    }
    e.innerHTML += "% em <bold>qualquer</bold> compra dentro do servidor"
}

function descontoImposto(s){
    const pai = document.getElementById("beneficios")
    const e = document.getElementById("descontoI")
    e.innerHTML = "<strong>•</strong> Desconto de "
    if(s == "solidus"){
        e.innerHTML += solidusI
        if (solidusI <= 0){
            pai.removeChild(e)
        }
    }else if(s == "denarius"){
        e.innerHTML += denariusI
        if (denariusI <= 0){
            pai.removeChild(e)
        }
    }else if(s == "obolus"){
        e.innerHTML += obolusI
        if (obolusI <= 0){
            pai.removeChild(e)
        }
    }else if(s == "quadrans"){
        e.innerHTML += quadransI
        if (quadransI <= 0){
            pai.removeChild(e)
        }
    }
    e.innerHTML += "% em <bold>todos</bold> os impostos"
}

function ganhaCondado(s){
    const e = document.getElementById("condado")
    const pai = document.getElementById("beneficios")
    let str = "<strong>•</strong> Imediatamente ganha um <bold>condado</bold>"
    if (s == "solidus"){
        if (ganhaCondadoSolidus){
            e.innerHTML = str
        }else{
            pai.removeChild(e)
        }
    }else if (s == "denarius"){
        if (ganhaCondadoDenarius){
            e.innerHTML = str
        }else{
            pai.removeChild(e)
        }
    }else if (s == "obolus"){
        if (ganhaCondadoObolus){
            e.innerHTML = str
        }else{
            pai.removeChild(e)
        }
    }else if (s == "quadrans"){
        if (ganhaCondadoQuadrans){
            e.innerHTML = str
        }else{
            pai.removeChild(e)
        }
    }
}

function mudarPreco(s){
    const e = document.getElementById("mensal")
    const e2 = document.getElementById("trimestral")
    const e3 = document.getElementById("anual")
    if (s == "solidus"){
        e.innerHTML += solidusMensal
        e2.innerHTML += solidusTrimestral
        e3.innerHTML += solidusAnual
    }else if (s == "denarius"){
        e.innerHTML += denariusMensal
        e2.innerHTML += denariusTrimestral
        e3.innerHTML += denariusAnual
    }else if (s == "obolus"){
        e.innerHTML += obolusMensal
        e2.innerHTML += obolusTrimestral
        e3.innerHTML += obolusAnual
    }else if (s == "quadrans"){
        e.innerHTML += quadransMensal
        e2.innerHTML += quadransTrimestral
        e3.innerHTML += quadransAnual
    }
}

function onLoad(s){
    Promise.all([
        desconto(s),
        descontoImposto(s),
        ganhaCondado(s),
        mudarPreco(s)
    ]).then(() => {
        hideLoading();
    });
}