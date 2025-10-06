const btnsStartPause = document.querySelector(".btns-start-pause");
const html = document.querySelector("html");
const minutosTela = document.getElementById("minutos");
const segundosTela = document.getElementById("segundos");
const pauseStart = document.getElementById("start-pause-img");
const modo = document.querySelector(".modo");
const favicon = document.getElementById("favicon");

const btnFocoCurto = document.querySelector(".btn-foco-curto");
const btnFocoLongo = document.querySelector(".btn-foco-longo");
const btnCurto = document.querySelector(".btn-curto");
const btnLongo = document.querySelector(".btn-longo");
const btnsSecundarios = document.querySelectorAll(".btn-secondary");

const alerta = document.querySelector(".overlay");
const alertParagrafo = document.querySelector(".alert-p");

const audioPlay = new Audio("./sounds/button-press.mp3");
const alarm = new Audio("./sounds/clock-alarm.mp3");
alarm.loop = true;
alarm.volume = 0.7;

let intervalo = null;
let tempoEmSegundos = 1500;

// Primeiro, pede permissão ao usuário
if (Notification.permission === "default") {
  Notification.requestPermission();
}

// Função para mostrar a notificação
function mostrarNotificacao(titulo, corpo) {
  if (Notification.permission === "granted") {
    new Notification(titulo, {
      body: corpo,
      icon: "./img/logo_focus.svg",
    });
  } else {
    console.log("Permissão de notificação negada.");
  }
}

const playIcon = '<path d="M8 5v14l11-7z"/>';
const pauseIcon = '<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>';

const toggleDark = document.getElementById("toggle-dark");

// 🔹 Recupera do localStorage o estado do Dark Mode
const darkSalvo = JSON.parse(localStorage.getItem("darkMode"));
let darkAtivo;

if (darkSalvo !== null) {
  toggleDark.checked = darkSalvo;
  darkAtivo = darkSalvo;
} else {
  darkAtivo = toggleDark.checked;
}

// 🔹 Aplica o modo salvo logo ao carregar
(function aplicarModoInicial() {
  const modoAtual = html.dataset.modo;

  if (darkAtivo) {
    if (modoAtual === "foco") trocarDeModo("foco-dark", false);
    if (modoAtual === "curto") trocarDeModo("curto-dark", false);
    if (modoAtual === "longo") trocarDeModo("longo-dark", false);
  } else {
    if (modoAtual === "foco-dark") trocarDeModo("foco", false);
    if (modoAtual === "curto-dark") trocarDeModo("curto", false);
    if (modoAtual === "longo-dark") trocarDeModo("longo", false);
  }
})();

// 🔹 Salva a preferência no localStorage
function salvarEstadoDoToggleDark() {
  darkAtivo = toggleDark.checked;
  localStorage.setItem("darkMode", JSON.stringify(darkAtivo));
}

// 🔹 Listener para toggle Dark Mode
toggleDark.addEventListener("change", () => {
  salvarEstadoDoToggleDark();
  darkAtivo = toggleDark.checked;
  const modoAtual = html.dataset.modo;

  if (darkAtivo) {
    if (modoAtual === "foco") trocarDeModo("foco-dark", false);
    if (modoAtual === "curto") trocarDeModo("curto-dark", false);
    if (modoAtual === "longo") trocarDeModo("longo-dark", false);
  } else {
    if (modoAtual === "foco-dark") trocarDeModo("foco", false);
    if (modoAtual === "curto-dark") trocarDeModo("curto", false);
    if (modoAtual === "longo-dark") trocarDeModo("longo", false);
  }
});

// 🔹 Controle do som
const toggleSound = document.getElementById("toggle-sound");
let somAtivo = toggleSound.checked;

toggleSound.addEventListener("change", () => {
  somAtivo = toggleSound.checked;

  if (somAtivo) {
    if (!musicaFoco.src || musicaFoco.src.endsWith("#")) {
      proximaMusicaAleatoria();
    } else {
      musicaFoco.play();
    }
  } else {
    musicaFoco.pause();
  }
});

const btnAlert = document.getElementById("alert-button");

btnAlert.addEventListener("click", () => {
  alerta.classList.remove("active");
  alarm.pause();
  alarm.currentTime = 0;
});

// 🔹 Contagem do timer
function iniciarOuPausarContagem() {
  minutosTela.classList.add("ativo");
  segundosTela.classList.add("ativo");
  audioPlay.play();
  const valorModo = html.dataset.modo;
  const modoBase = valorModo.replace("-dark", "");

  if (tempoEmSegundos === 0 && modoBase === "foco") {
    alerta.classList.add("active");
    alertParagrafo.textContent = "Escolha uma pausa curta ou longa!";
    return;
  } else if (tempoEmSegundos === 0) {
    alerta.classList.add("active");
    alertParagrafo.textContent = "Hora de voltar para o foco!";
    return;
  }

  if (intervalo) {
    minutosTela.classList.remove("ativo");
    segundosTela.classList.remove("ativo");
    pauseStart.innerHTML = playIcon;
    clearInterval(intervalo);
    intervalo = null;
    return;
  }

  pauseStart.innerHTML = pauseIcon;
  intervalo = setInterval(() => {
    tempoEmSegundos -= 1;
    mostrarNaTela();
  }, 1000);
}

function mostrarNaTela() {
  const minutos = Math.floor(tempoEmSegundos / 60);
  const segundos = tempoEmSegundos % 60;

  if (tempoEmSegundos <= 0) {
    if (intervalo !== null) {
      alarm.play();
      clearInterval(intervalo);
      intervalo = null;
      pauseStart.innerHTML = playIcon;
      minutosTela.classList.remove("ativo");
      segundosTela.classList.remove("ativo");
      minutosTela.textContent = "00";
      segundosTela.textContent = "00";

      const modoBase = html.dataset.modo.replace("-dark", "");
      alerta.classList.add("active");
      if (modoBase === "foco") {
        alertParagrafo.textContent = "Escolha uma pausa curta ou longa!";
        mostrarNotificacao(
          "Pomodoro finalizado 🍅",
          "Hora de fazer uma pausa!"
        );
      } else {
        alertParagrafo.textContent = "Hora de voltar para o foco!";
        mostrarNotificacao(
          "A hora pausa acabou 🍅",
          "Hora de voltar para o foco!"
        );
      }
    }
    return;
  }

  minutosTela.textContent = minutos.toString().padStart(2, "0");
  segundosTela.textContent = segundos.toString().padStart(2, "0");
}

btnsStartPause.addEventListener("click", iniciarOuPausarContagem);

// 🔹 Alternar modos (curto, longo, foco)
btnsSecundarios.forEach((btn) => {
  btn.addEventListener("click", () => {
    darkAtivo = toggleDark.checked;
    let valorDoBtn = btn.value;

    if (darkAtivo && !valorDoBtn.includes("-dark")) {
      valorDoBtn = valorDoBtn + "-dark";
    }

    trocarDeModo(valorDoBtn, true);
  });
});

// 🔹 Troca de modos
function trocarDeModo(novoModo, atualizarTempo = true) {
  html.setAttribute("data-modo", novoModo);

  const modoBase = novoModo.replace("-dark", "");

  if (atualizarTempo) {
    clearInterval(intervalo);
    intervalo = null;
    pauseStart.innerHTML = playIcon;
    alarm.currentTime = 0;
    alarm.pause();
    minutosTela.classList.remove("ativo");
    segundosTela.classList.remove("ativo");

    switch (modoBase) {
      case "foco":
        tempoEmSegundos = 1500;
        break;
      case "curto":
        tempoEmSegundos = 300;
        break;
      case "longo":
        tempoEmSegundos = 900;
        break;
    }
  } else {
    // 🔹 Se o tempo atual estiver zerado, reseta automaticamente
    if (tempoEmSegundos <= 0) {
      switch (modoBase) {
        case "foco":
          tempoEmSegundos = 1500;
          break;
        case "curto":
          tempoEmSegundos = 300;
          break;
        case "longo":
          tempoEmSegundos = 900;
          break;
      }
    }
  }

  // 🔹 Atualiza a interface conforme o modo
  switch (novoModo) {
    case "foco":
      favicon.href = "img/logo_focus.svg";
      modo.innerHTML = '<img src="./img/ph_brain-fill.svg" />Focus';
      btnFocoCurto.style.display = "none";
      btnFocoLongo.style.display = "none";
      btnCurto.style.display = "block";
      btnLongo.style.display = "block";
      break;

    case "curto":
      favicon.href = "img/logo_short_break.svg";
      modo.innerHTML = '<img src="./img/ph_coffee_green.svg" />Short Break';
      btnFocoCurto.style.display = "block";
      btnFocoLongo.style.display = "none";
      btnCurto.style.display = "none";
      btnLongo.style.display = "block";
      break;

    case "longo":
      favicon.href = "img/logo_long_break.svg";
      modo.innerHTML = '<img src="./img/ph_coffee_blue.svg" />Long Break';
      btnFocoCurto.style.display = "none";
      btnFocoLongo.style.display = "block";
      btnCurto.style.display = "block";
      btnLongo.style.display = "none";
      break;

    case "foco-dark":
      favicon.href = "img/logo_focus.svg";
      modo.innerHTML = '<img src="./img/ph_brain-fill-focus-dark.svg" />Focus';
      btnFocoCurto.style.display = "none";
      btnFocoLongo.style.display = "none";
      btnCurto.style.display = "block";
      btnLongo.style.display = "block";
      break;

    case "curto-dark":
      favicon.href = "img/logo_short_break.svg";
      modo.innerHTML =
        '<img src="./img/ph_coffee-green-dark.svg" />Short Break';
      btnFocoCurto.style.display = "block";
      btnFocoLongo.style.display = "none";
      btnCurto.style.display = "none";
      btnLongo.style.display = "block";
      break;

    case "longo-dark":
      favicon.href = "img/logo_long_break.svg";
      modo.innerHTML = '<img src="./img/ph_coffee-blue-dark.svg" />Long Break';
      btnFocoCurto.style.display = "none";
      btnFocoLongo.style.display = "block";
      btnCurto.style.display = "block";
      btnLongo.style.display = "none";
      break;
  }

  // 🔹 Atualiza a contagem na tela após a troca
  mostrarNaTela();
}

mostrarNaTela();
