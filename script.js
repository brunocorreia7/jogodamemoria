const restartBut = document.querySelector("#restartBut");
const gameContainer = document.querySelector(".game-container");
const movesCounter = document.querySelector("#moves-counter");
const winMessage = document.querySelector("#win-message");
const playAgainBtn = document.querySelector("#play-again-btn");
const timerDisplay = document.querySelector("#timer");

// Imagens ou símbolos para o jogo (corrigido o caminho das imagens)
const cards = [
  "fotoanimais/cachorro.webp", "fotoanimais/cachorro.webp",
  "fotoanimais/galo.jpeg", "fotoanimais/galo.jpeg",
  "fotoanimais/gato.webp", "fotoanimais/gato.webp",
  "fotoanimais/macaco.jpeg", "fotoanimais/macaco.jpeg",
  "fotoanimais/passarinho.jpeg", "fotoanimais/passarinho.jpeg",
  "fotoanimais/pintinho.jpg", "fotoanimais/pintinho.jpg",
];

// Embaralha as cartas
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Renderiza as cartas no tabuleiro
function createCards() {
  const shuffledCards = shuffle(cards);

  shuffledCards.forEach((symbol) => {
    const card = document.createElement("div");
    card.classList.add("card");

    // Cria o lado da frente e de trás da carta com imagens
    card.innerHTML = `
      <div class="front"><img src="${symbol}" alt="Imagem" class="card-image"></div>
      <div class="back">?</div>
    `;

    // Adiciona evento de clique à carta
    card.addEventListener("click", handleCardClick);

    gameContainer.appendChild(card);
  });
}

// Lógica para verificar pares
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0; // Contador de movimentos
let matchedPairs = 0; // Contador de pares encontrados
let startTime = null; // Hora de início do jogo
let timerInterval = null; // Intervalo para o cronômetro

function updateMoves() {
  moves++;
  movesCounter.textContent = `Movimentos: ${moves}`;
}

function updateTimer() {
  const elapsedTime = Math.floor((Date.now() - startTime) / 1000); // Tempo em segundos
  timerDisplay.textContent = `Tempo: ${elapsedTime}s`;
}

function handleCardClick(e) {
  const clickedCard = e.currentTarget;

  // Previne ações em cartas já viradas
  if (clickedCard.classList.contains("flipped") || lockBoard) return;

  clickedCard.classList.add("flipped");

  if (!firstCard) {
    firstCard = clickedCard;
    return;
  }

  secondCard = clickedCard;

  // Incrementa o contador de movimentos a cada jogada
  updateMoves();

  checkForMatch();
}

function checkForMatch() {
  const firstSymbol = firstCard.querySelector(".front img").src;
  const secondSymbol = secondCard.querySelector(".front img").src;

  if (firstSymbol === secondSymbol) {
    matchedPairs++;
    resetTurn();

    // Verifica se todos os pares foram encontrados
    if (matchedPairs === cards.length / 2) {
      clearInterval(timerInterval); // Para o cronômetro
      setTimeout(() => {
        winMessage.style.display = "block"; // Exibe a mensagem de vitória
      }, 500); // Delay para garantir que as cartas viradas sejam vistas
    }
  } else {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetTurn();
    }, 1000);
  }
}

function resetTurn() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

// Função para reiniciar o jogo
function restartGame() {
  // Limpa o tabuleiro
  gameContainer.innerHTML = "";

  // Reseta variáveis do jogo
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  moves = 0;
  matchedPairs = 0;
  movesCounter.textContent = `Movimentos: ${moves}`;
  timerDisplay.textContent = `Tempo: 0s`; // Reseta o cronômetro
  winMessage.style.display = "none"; // Esconde a mensagem de vitória

  // Inicia o cronômetro imediatamente
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000); // Atualiza o cronômetro a cada segundo

  // Recria as cartas
  createCards();
}

// Adiciona evento ao botão de reinício
restartBut.addEventListener("click", restartGame);

// Adiciona evento ao botão de "Jogar Novamente"
playAgainBtn.addEventListener("click", restartGame);

// Inicializa o jogo
restartGame();
