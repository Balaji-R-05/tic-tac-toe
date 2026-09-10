const cells = document.querySelectorAll('.cell');
const resetBtn = document.getElementById('resetBtn');
const message = document.getElementById('message');
const scoreXDisplay = document.getElementById('scoreX');
const scoreODisplay = document.getElementById('scoreO');
const modeSwitch = document.getElementById('modeSwitch');
const difficultySelect = document.getElementById('difficulty');
const clearStatsBtn = document.getElementById('clearStatsBtn');
const moveList = document.getElementById('moveList');

// The game starts in local two-player mode. AI mode changes the value to '1p'.
let gameMode = '2p';

// Scores persist between visits, while the board and move history do not.
let savedScores = JSON.parse(localStorage.getItem('tic-tac-toe-scores')) || { x: 0, o: 0 };
let scoreX = savedScores.x;
let scoreO = savedScores.o;

// Update initial display
scoreXDisplay.textContent = scoreX;
scoreODisplay.textContent = scoreO;

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




/** Handle a human player's attempt to select a board cell. */
function handleCellClick(e) {
    const index = e.target.dataset.index;

    if (!gameActive || board[index] !== '') return;

    board[index] = currentPlayer;
    e.target.textContent = currentPlayer;
    e.target.classList.add(currentPlayer === 'X' ? 'x-mark' : 'o-mark');

    addMoveToHistory(currentPlayer, index);

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
        setTimeout(makeAIMove, 300); // Give the player a moment to see their move.
    }
}

/** Choose and apply the computer's move according to the selected difficulty. */
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
    cells[move].classList.add('o-mark');

    addMoveToHistory('O', move);

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
/** Return the index of a randomly selected empty cell. */
function getRandomMove() {
    const emptyIndexes = board
        .map((val, idx) => val === '' ? idx : null)
        .filter(val => val !== null);

    return emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
}



/** Return the completed winning pattern, or null when there is no winner. */
function checkWinner(targetBoard = board) {
    for (let combo of winningCombos) {
        const [a, b, c] = combo;
        if (targetBoard[a] && targetBoard[a] === targetBoard[b] && targetBoard[a] === targetBoard[c]) {
            return combo;
        }
    }
    return null;
}

/** Add the winning style to each cell in a completed pattern. */
function highlightWin(combo) {
    combo.forEach(index => cells[index].classList.add('win'));
}

/** Increment a player's score and persist the updated totals in localStorage. */
function updateScore(player) {
    if (player === 'X') {
        scoreX++;
        scoreXDisplay.textContent = scoreX;
    } else {
        scoreO++;
        scoreODisplay.textContent = scoreO;
    }
    // Save to localStorage
    localStorage.setItem('tic-tac-toe-scores', JSON.stringify({ x: scoreX, o: scoreO }));
}

/** Clear the current round without changing the persistent scores. */
function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    message.textContent = '';
    moveList.innerHTML = '';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('win', 'x-mark', 'o-mark');
    });
    if (confetti) confetti.clear();
}

/** Add a human-readable row and column entry to the move history. */
function addMoveToHistory(player, index) {
    const li = document.createElement('li');
    const row = Math.floor(index / 3) + 1;
    const col = (index % 3) + 1;
    li.textContent = `${player}: Row ${row}, Col ${col}`;
    moveList.appendChild(li);
    moveList.scrollTop = moveList.scrollHeight;
}

/** Start the victory animation provided by Confetti-JS. */
function launchConfetti() {
    confetti = new ConfettiGenerator(confettiSettings);
    confetti.render();
}

/**
 * Evaluate possible future moves and return the best move for the player.
 * O maximizes the score, X minimizes it, and a draw scores zero.
 */
function minimax(newBoard, player) {
    const availSpots = newBoard.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);

    const winnerCombo = checkWinner(newBoard);
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

clearStatsBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all persistent statistics?')) {
        scoreX = 0;
        scoreO = 0;
        scoreXDisplay.textContent = '0';
        scoreODisplay.textContent = '0';
        localStorage.removeItem('tic-tac-toe-scores');
    }
});

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', resetGame);