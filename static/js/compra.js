const botao = document.getElementById("compreja")
const vippage = botao.dataset.vipPage
let plano = ""

function mostrarBotao(){
  const sel = document.getElementById("plano")
  const opt = sel.options[sel.selectedIndex]
  const valor = opt.value
  if (valor == "mensal"){
    if(vippage == "solidus"){
      plano = "1"
    }
    else if(vippage == "denarius"){
      plano = "4"
    }
    else if(vippage == "obolus"){
      plano = "7"
    }
    else if(vippage == "quadrans"){
      plano = "10"
    }
  }
  else if (valor == "trimestral"){
    if(vippage == "solidus"){
      plano = "2"
    }
    else if(vippage == "denarius"){
      plano = "5"
    }
    else if(vippage == "obolus"){
      plano = "8"
    }
    else if(vippage == "quadrans"){
      plano = "11"
    }
  }
  else if (valor == "anual"){
    if (vippage == "solidus"){
      plano = "3"
    }
    else if(vippage == "denarius"){
      plano = "6"
    }
    else if(vippage == "obolus"){
      plano = "9"
    }
    else if(vippage == "quadrans"){
      plano = "12"
    }
  }
}


fetch("/config")
.then((result) => { return result.json(); })
.then((data) => {
  // Initialize Stripe.js
  const stripe = Stripe(data.publicKey);
  
  document.getElementById("compreja").addEventListener("click", () => {
    showLoading()
    // Get Checkout Session ID
    fetch("/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        plano
      })
    })
    .then((result) => { return result.json(); })
    .then((data) => {
      // Redirect to Stripe Checkout
      hideLoading()
      return stripe.redirectToCheckout({sessionId: data.sessionId})
    })
  });
});