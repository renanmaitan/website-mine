// If you don't want the particles, change the following to false
const doParticles = true;


// Função para obter um cookie específico pelo nome
function getCookie(name) {
    const cookieString = document.cookie;
    const cookies = cookieString.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + '=')) {
        return cookie.substring(name.length + 1);
      }
    }
    return null;
}

const isLoggedIn = getCookie('logged_in');
const user = getCookie('user');

if (isLoggedIn === 'true') {
    const navbar = document.getElementById('navbar');
    const logout = document.createElement('a');
    logout.innerHTML = 'Logout';
    logout.setAttribute('href', '/logout');
    logout.setAttribute('id', 'logout');
    const perfil = document.createElement('a');
    perfil.innerHTML = user;
    perfil.setAttribute('href', '/perfil');
    perfil.setAttribute('id', 'perfil');
    perfil.setAttribute('class', 'perfilLink');
    const login = document.getElementById('login');
    login.innerHTML = '';
    if (login) {
        navbar.removeChild(login);
    }

    navbar.appendChild(logout);
    navbar.appendChild(perfil);
} else {
    const navbar = document.getElementById('navbar');
    const perfil = document.getElementById('perfil');
    const logout = document.getElementById('logout');
    if (perfil) {
        navbar.removeChild(perfil);
    }
    if (logout) {
        navbar.removeChild(logout);
    }
    const login = document.getElementById('login');
    if(!login){
        const login = document.createElement('a');
        login.innerHTML = 'Login';
        login.setAttribute('href', '/login');
        login.setAttribute('id', 'login');
        navbar.appendChild(login);
    }
}

// Função para obter um cookie específico pelo nome
function getCookie(name) {
    const cookieString = document.cookie;
    const cookies = cookieString.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
}


// Do not mess with the rest of this file unless you know what you're doing

const getWidth = () => { // credit to travis on stack overflow
    return Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
    );
};

if (doParticles) {
    if (getWidth() < 400) $.firefly({
        minPixel: 1,
        maxPixel: 2,
        total: 20
    });
    else $.firefly({
        minPixel: 1,
        maxPixel: 3,
        total: 40
    });
}

// This is for the click to copy
let t;
$(document).ready(() => {
    t = $(".ip").html();
});

$(document).on("click", ".ip", () => {
    let copy = document.createElement("textarea");
    copy.style.position = "absolute";
    copy.style.left = "-99999px";
    copy.style.top = "0";
    copy.setAttribute("id", "ta");
    document.body.appendChild(copy);
    copy.textContent = t;
    copy.select();
    document.execCommand("copy");
    $(".ip").html("<span class='extrapad'>IP copied!</span>");
    setTimeout(() => {
        $(".ip").html(t);
        var copy = document.getElementById("ta");
        copy.parentNode.removeChild(copy);
    }, 800);
});

// This is to fetch the player count
$(document).ready(() => {
    let ip = $(".sip").attr("data-ip");
    let port = $(".sip").attr("data-port");
    if (port == "" || port == null) port = "25565";
    if (ip == "" || ip == null) return console.error("Error fetching player count - is the IP set correctly in the HTML?");
    updatePlayercount(ip, port);
    // Updates every minute (not worth changing due to API cache)
    setInterval(() => {
        updatePlayercount(ip, port);
    }, 60000);
});

const updatePlayercount = (ip, port) => {
    $.get(`https://api.bybilly.uk/api/players/${ip}/${port}`, (result) => {
        if (result.hasOwnProperty('online')) {
            $(".sip").html(result.online);
        } else {
            $(".playercount").html("Server isn't online!");
        }
    });
};
