let loadingIntervalId;

function showLoading(){
    const div = document.createElement("div")
    div.setAttribute("class", "loading")
    
    const label = document.createElement("label")
    label.innerText = "Carregando"
    div.appendChild(label)
    document.body.appendChild(div)

    let dotCount = 0;
    loadingIntervalId = setInterval(() => {
        dotCount++;
        if (dotCount > 4) dotCount = 0;
        label.innerText = "Carregando" + ".".repeat(dotCount);
    }, 650);
}

function hideLoading(){
    clearInterval(loadingIntervalId);
    
    const targetDiv = document.getElementById("targetDiv");
    if (targetDiv) {
        targetDiv.scrollIntoView({ behavior: "smooth" });
    }
    const loadingElement = document.querySelector(".loading");
    if (loadingElement) {
        document.body.removeChild(loadingElement);
    }
}