function alterna(){
    imagem = document.getElementById("alternar")
    if(imagem.style.visibility == "hidden"){
        document.getElementById("mostrar").style.visibility = "hidden"
        imagem.style.visibility = "visible"
        document.getElementById("password").type = "password"
    }else{
        document.getElementById("mostrar").style.visibility = "visible"
        imagem.style.visibility = "hidden"
        document.getElementById("password").type = "text"
    }
}

function alternaCad(){
    imagem = document.getElementById("alternarCad")
    if(imagem.style.visibility == "hidden"){
        document.getElementById("mostrarCad").style.visibility = "hidden"
        imagem.style.visibility = "visible"
        document.getElementById("passwordConfirm").type = "password"
    }else{
        document.getElementById("mostrarCad").style.visibility = "visible"
        imagem.style.visibility = "hidden"
        document.getElementById("passwordConfirm").type = "text"
    }
}