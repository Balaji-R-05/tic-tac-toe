const cells = document.querySelectorAll('.cell');
const resetBtn = document.getElementById('resetBtn');
const message = document.getElementById('message');
const scoreXDisplay = document.getElementById('scoreX');
const scoreODisplay = document.getElementById('scoreO');
const modeSwitch = document.getElementById('modeSwitch');
const difficultySelect = document.getElementById('difficulty');

let gameMode = '2p'; // default 2 player
let scoreX = 0;
let scoreO = 0;
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let confetti;
let difficulty = difficultySelect.value;

const confettiSettings = {
    target: 'confetti-canvas',
    respawn: true,
    max: 150,
    size: 1.2,
    animate: true,
    props: ['circle', 'square', 'triangle'],
    colors: [
        [255, 0, 0], [0, 255, 0], [0, 0, 255],
        [255, 255, 0], [255, 105, 180], [0, 255, 255],
        [255, 165, 0], [255, 255, 255],
    ]
};

const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];




function handleCellClick(e) {
    const index = e.target.dataset.index;

    if (!gameActive || board[index] !== '') return;

    board[index] = currentPlayer;
    e.target.textContent = currentPlayer;

    const winnerCombo = checkWinner();
    if (winnerCombo) {
        highlightWin(winnerCombo);
        message.textContent = `🎉 ${currentPlayer} wins! 🎉`;
        gameActive = false;
        updateScore(currentPlayer);
        launchConfetti();
        return;
    }

    if (board.every(cell => cell !== '')) {
        message.textContent = "It's a Draw! 🤝";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

    if (gameMode === '1p' && currentPlayer === 'O') {
        setTimeout(makeAIMove, 300); // slight delay for better UX
    }
}

function makeAIMove() {
    if (!gameActive) return;

    let move;

    if (difficulty === 'easy') {
        move = getRandomMove();
    } else if (difficulty === 'medium') {
        move = Math.random() < 0.5 ? getRandomMove() : minimax(board, 'O').index;
    } else {
        move = minimax(board, 'O').index;
    }

    board[move] = 'O';
    cells[move].textContent = 'O';

    const winnerCombo = checkWinner();
    if (winnerCombo) {
        highlightWin(winnerCombo);
        message.textContent = `🎉 O wins! 🎉`;
        gameActive = false;
        updateScore('O');
        launchConfetti();
        return;
    }

    if (board.every(cell => cell !== '')) {
        message.textContent = "It's a Draw! 🤝";
        gameActive = false;
        return;
    }

    currentPlayer = 'X';
}
function getRandomMove() {
    const emptyIndexes = board
        .map((val, idx) => val === '' ? idx : null)
        .filter(val => val !== null);

    return emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
}



function checkWinner() {
    for (let combo of winningCombos) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return combo;
        }
    }
    return null;
}

function highlightWin(combo) {
    combo.forEach(index => cells[index].classList.add('win'));
}

function updateScore(player) {
    if (player === 'X') {
        scoreX++;
        scoreXDisplay.textContent = scoreX;
    } else {
        scoreO++;
        scoreODisplay.textContent = scoreO;
    }
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    message.textContent = '';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('win');
    });
    if (confetti) confetti.clear();
}

function launchConfetti() {
    confetti = new ConfettiGenerator(confettiSettings);
    confetti.render();
}

function minimax(newBoard, player) {
    const availSpots = newBoard.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);

    const winnerCombo = checkWinner();
    if (winnerCombo && newBoard[winnerCombo[0]] === 'X') {
        return { score: -10 };
    } else if (winnerCombo && newBoard[winnerCombo[0]] === 'O') {
        return { score: 10 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }

    const moves = [];

    for (let i = 0; i < availSpots.length; i++) {
        const move = {};
        move.index = availSpots[i];
        newBoard[availSpots[i]] = player;

        if (player === 'O') {
            const result = minimax(newBoard, 'X');
            move.score = result.score;
        } else {
            const result = minimax(newBoard, 'O');
            move.score = result.score;
        }

        newBoard[availSpots[i]] = '';
        moves.push(move);
    }

    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

modeSwitch.addEventListener('change', () => {
    gameMode = modeSwitch.checked ? '1p' : '2p';
    resetGame();
    difficultySelect.disabled = gameMode !== '1p';
});
difficultySelect.addEventListener('change', () => {
    difficulty = difficultySelect.value;
});
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', resetGame);