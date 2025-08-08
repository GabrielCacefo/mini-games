document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos do DOM
    const gameContainer = document.querySelector('.memory-game');
    const movesSpan = document.getElementById('moves');
    const timerSpan = document.getElementById('timer');
    const restartBtn = document.getElementById('restart-btn');

    // Array com as informações dos pilotos e os CAMINHOS LOCAIS das imagens
    // Certifique-se de que os nomes dos arquivos aqui correspondem aos nomes na sua pasta 'assets'!
    const drivers = [
        { name: 'Albon', img: 'assets/Albon.png' },
        { name: 'Alonso', img: 'assets/Alonso.png' },
        { name: 'Antonelli', img: 'assets/Antonelli.png' },
        { name: 'Bearman', img: 'assets/Bearman.png' },
        { name: 'Bortoleto', img: 'assets/Bortoleto.png' },
        { name: 'Colapinto', img: 'assets/Colapinto.png' },
        { name: 'Gasly', img: 'assets/Gasly.png' },
        { name: 'Hadjar', img: 'assets/Hadjar.png' },
        { name: 'Hamilton', img: 'assets/Hamilton.png' },
        { name: 'Hulkenberg', img: 'assets/Hulkenberg.png' },
        { name: 'Lawson', img: 'assets/Lawson.png' },
        { name: 'Leclerc', img: 'assets/Leclerc.png' },
        { name: 'Norris', img: 'assets/Norris.png' },
        { name: 'Ocon', img: 'assets/Ocon.png' },
        { name: 'Piastri', img: 'assets/Piastri.png' },
        { name: 'Russel', img: 'assets/Russel.png' },
        { name: 'Sainz', img: 'assets/Sainz.png' },
        { name: 'Stroll', img: 'assets/Stroll.png' },
        { name: 'Tsunoda', img: 'assets/Tsunoda.png' },
        { name: 'Vertappen', img: 'assets/Verstappen.png' },
    ];

    let cards = [...drivers, ...drivers]; // Duplica o array para formar os pares

    // Variáveis de estado do jogo
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let moves = 0;
    let timer = 0;
    let timerInterval;
    let matchedPairs = 0;

    // Função para embaralhar as cartas
    function shuffle(array) {
        array.sort(() => 0.5 - Math.random());
    }

    // Função para criar o tabuleiro
    function createBoard() {
        gameContainer.innerHTML = ''; // Limpa o tabuleiro anterior
        shuffle(cards);
        cards.forEach(cardInfo => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('memory-card');
            cardElement.dataset.name = cardInfo.name;

            // Cria a frente e o verso da carta
            cardElement.innerHTML = `
                <div class="front-face">
                    <img src="${cardInfo.img}" alt="${cardInfo.name}">
                </div>
                <div class="back-face"></div>
            `;
            gameContainer.appendChild(cardElement);
            // Adiciona o evento de clique a cada carta
            cardElement.addEventListener('click', flipCard);
        });
    }

    // Função para iniciar o cronômetro
    function startTimer() {
        timer = 0;
        timerSpan.textContent = `${timer}s`;
        timerInterval = setInterval(() => {
            timer++;
            timerSpan.textContent = `${timer}s`;
        }, 1000);
    }

    // Função para parar o cronômetro
    function stopTimer() {
        clearInterval(timerInterval);
    }

    // Função para virar a carta
    function flipCard() {
        if (lockBoard) return; // Impede virar mais de duas cartas
        if (this === firstCard) return; // Impede clicar na mesma carta duas vezes

        this.classList.add('flip');

        if (!hasFlippedCard) {
            // Primeiro clique
            hasFlippedCard = true;
            firstCard = this;
            if (moves === 0 && !timerInterval) { // Inicia o timer no primeiro movimento
                startTimer();
            }
            return;
        }

        // Segundo clique
        secondCard = this;
        incrementMoves();
        checkForMatch();
    }

    // Função para checar se as cartas são iguais
    function checkForMatch() {
        let isMatch = firstCard.dataset.name === secondCard.dataset.name;
        isMatch ? disableCards() : unflipCards();
    }

    // Função para desabilitar as cartas quando formam um par
    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        matchedPairs++;
        resetBoard();
        checkWin();
    }

    // Função para desvirar as cartas se não forem um par
    function unflipCards() {
        lockBoard = true; // Bloqueia o tabuleiro
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            resetBoard(); // Desbloqueia após a animação
        }, 1200);
    }

    // Função para resetar as variáveis de jogada
    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    // Função para incrementar os movimentos
    function incrementMoves() {
        moves++;
        movesSpan.textContent = moves;
    }

    // Função para verificar se o jogo terminou
    function checkWin() {
        if (matchedPairs === drivers.length) {
            stopTimer();
            setTimeout(() => {
                alert(`Parabéns! Você venceu em ${moves} movimentos e ${timer} segundos!`);
            }, 500);
        }
    }

    // Função para reiniciar o jogo
    function restartGame() {
        stopTimer();
        timerInterval = null; // Garante que o timer pare completamente
        moves = 0;
        matchedPairs = 0;
        movesSpan.textContent = moves;
        timerSpan.textContent = '0s';
        resetBoard();
        createBoard();
    }

    // Adiciona o evento de clique ao botão de reiniciar
    restartBtn.addEventListener('click', restartGame);

    // Inicia o jogo pela primeira vez
    createBoard();
});