const musicasFoco = [
  "./sounds/musicas/tokyo-city-lofi-365949.mp3",
  "./sounds/musicas/cozy-evening-chill-lofi-beats-365936.mp3",
  "./sounds/musicas/moonlit-pathways-skyrim-lofi-journey-406715.mp3",
  "./sounds/musicas/dream-in-loops-lofi-music-351758.mp3",
  "./sounds/musicas/rainy-day-lofi-356060.mp3",
  "./sounds/musicas/ambient-lofi-lofi-music-1.mp3",
  "./sounds/musicas/coffee-lofi-lofi-music-2.mp3",
  "./sounds/musicas/dream-waves-ambient-lofi-400370.mp3",
  "./sounds/musicas/lofi-3.mp3",
  "./sounds/musicas/lofi-background-music-4.mp3",
  "./sounds/musicas/lofi-girl-5.mp3",
  "./sounds/musicas/lofi-girl-lofi-ambient-music-6.mp3",
  "./sounds/musicas/lofi-girl-lofi-hiphop-beats-7.mp3",
  "./sounds/musicas/spring-lofi-vibes-lofi-music-9.mp3",
];

const musicaFoco = new Audio();
musicaFoco.volume = 0.25;
musicaFoco.loop = false; // não repetir a mesma música automaticamente

// função para tocar uma música aleatória
function proximaMusicaAleatoria() {
  const index = Math.floor(Math.random() * musicasFoco.length);
  musicaFoco.src = musicasFoco[index];
  musicaFoco.play();
}

// toca a próxima música aleatoriamente quando terminar
musicaFoco.addEventListener("ended", () => {
  if (somAtivo) {
    // só toca se o toggle estiver ativo
    proximaMusicaAleatoria();
  }
});
