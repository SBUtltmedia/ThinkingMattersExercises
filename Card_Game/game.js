const urlParams = new URLSearchParams(window.location.search);

let phase=Math.min(urlParams.get('phase') || 1,4);


// Iterate through all parameters
for (const [key, value] of urlParams.entries()) {
  console.log(key, value);
}


const targetSum = 15;
const wordBindings = {
    2: "fear",
    7: "or",
    6: "try",
    9: "be",
    5: "boat",
    1: "by",
    4: "ten",
    3: "on",
    8: "any",
};
let availableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let playerNumbers = [];
let computerNumbers = [];
let gamesPlayed = 0;
let gameMode = 'word';
let currentPHASE = 1;
const boardElement = document.getElementById('board');
const gameStatus = document.getElementById('gameStatus');

function createBoard() {
    boardElement.innerHTML = '';
    boardElement.classList.remove('grid-layout');
    if (gameMode === 'xo' || gameMode === 'isomorphic') {
        boardElement.classList.add('grid-layout');
    }
    
    const magicSquareOrder = [2, 7, 6, 9, 5, 1, 4, 3, 8];
    magicSquareOrder.forEach(num => {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.number = num;
        
        switch(gameMode) {
            case 'word':
                cell.textContent = wordBindings[num];
                break;
            case 'number':
                cell.textContent = num;
                break;
            case 'xo':
                cell.classList.add('xo-cell');
                break;
            case 'isomorphic':
                cell.classList.add('isomorphic-cell');
                cell.innerHTML = `
                    <div class="main-symbol"></div>
                    <div class="sub-info">
                        <span>${num}</span>
                        <span>${wordBindings[num]}</span>
                    </div>
                `;
                break;
        }
        
        cell.addEventListener('click', handlePlayerMove);
        boardElement.appendChild(cell);
    });
}

function handlePlayerMove(event) {
    const cell = event.target.closest('.cell');
    if (gameStatus.textContent.includes('wins') || gameStatus.textContent.includes('tie')) {
        return;
    }
    
    if (!cell || !availableNumbers.includes(parseInt(cell.dataset.number))) return;

    const number = parseInt(cell.dataset.number);
    playerNumbers.push(number);
    availableNumbers = availableNumbers.filter(num => num !== number);

    updateCellDisplay(cell, 'player');

    if (checkWinningCombination(playerNumbers)) {
        gameStatus.textContent = 'You win!';
        if (currentPHASE === 4) {
            boardElement.classList.add('game-over');
        }
        endGame();
        return;
    }

    if (availableNumbers.length === 0) {
        gameStatus.textContent = "It's a tie!";
        if (currentPHASE === 4) {
            boardElement.classList.add('game-over');
        }
        endGame();
        return;
    }

    const bestMove = findBestMove();
    computerNumbers.push(bestMove);
    availableNumbers = availableNumbers.filter(num => num !== bestMove);

    const computerCell = document.querySelector(`[data-number="${bestMove}"]`);
    updateCellDisplay(computerCell, 'computer');

    if (checkWinningCombination(computerNumbers)) {
        gameStatus.textContent = 'Computer wins!';
        if (currentPHASE === 4) {
            boardElement.classList.add('game-over');
        }
        endGame();
        return;
    }

    if (availableNumbers.length === 0) {
        gameStatus.textContent = "It's a tie!";
        if (currentPHASE === 4) {
            boardElement.classList.add('game-over');
        }
        endGame();
    }
}

function updateCellDisplay(cell, player) {
    cell.classList.add(`taken-${player}`);
    const symbol = player === 'player' ? 'X' : 'O';

    switch(gameMode) {
        case 'word':
        case 'number':
            const currentContent = cell.textContent;
            cell.innerHTML = currentContent + `<span class="label">${player}</span>`;
            break;
        case 'xo':
            cell.textContent = symbol;
            break;
        case 'isomorphic':
            const mainSymbol = cell.querySelector('.main-symbol');
            mainSymbol.textContent = symbol;
            break;
    }
    
    cell.removeEventListener('click', handlePlayerMove);
}

function checkWinningCombination(numbers) {
    const n = numbers.length;
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            for (let k = j + 1; k < n; k++) {
                if (numbers[i] + numbers[j] + numbers[k] === targetSum) {
                    return true;
                }
            }
        }
    }
    return false;
}

function evaluate() {
    if (checkWinningCombination(computerNumbers)) return 10;
    if (checkWinningCombination(playerNumbers)) return -10;
    return 0;
}

function minimax(depth, isMaximizing) {
    const score = evaluate();
    if (score === 10 || score === -10 || availableNumbers.length === 0) return score;

    let best = isMaximizing ? -Infinity : Infinity;
    let targetNumbers = isMaximizing ? computerNumbers : playerNumbers;

    for (let num of availableNumbers) {
        targetNumbers.push(num);
        availableNumbers = availableNumbers.filter(n => n !== num);

        const currentScore = minimax(depth + 1, !isMaximizing);
        best = isMaximizing ? Math.max(best, currentScore) : Math.min(best, currentScore);

        availableNumbers.push(num);
        targetNumbers.pop();
    }

    return best;
}

function findBestMove() {
    let bestVal = -Infinity;
    let bestMove = -1;

    for (let num of availableNumbers) {
        computerNumbers.push(num);
        availableNumbers = availableNumbers.filter(n => n !== num);

        const moveVal = minimax(0, false);

        availableNumbers.push(num);
        computerNumbers.pop();

        if (moveVal > bestVal) {
            bestVal = moveVal;
            bestMove = num;
        }
    }

    return bestMove;
}

function endGame() {
    gamesPlayed++;
    if (gamesPlayed === 1) {
        showPhaseTransition(2);
    } else if (currentPHASE === 2) {
        showPhaseTransition(3);
    } else if (currentPHASE === 3) {
        showPhaseTransition(4);
    }
}

function showPhaseTransition(phase) {
    setTimeout(() => {
        document.getElementById(`phase${phase}-overlay`).style.display = 'flex';
    }, 1000);
}

function switchToPhase(phase) {
    const gameMode = document.getElementById('game-mode');
    const board = document.querySelector('.board');
    
    gameMode.style.animation = 'none';
    board.classList.remove('show');
    
    void gameMode.offsetWidth;
    
    gameMode.style.animation = 'phaseEntrance 1.5s ease-out forwards';
    
    setTimeout(() => {
        board.classList.add('show');
    }, 1000);
}

function switchToNumberMode() {
    switchToPhase(2);
    gameMode = 'number';
    currentPHASE = 2;
    document.getElementById('phase2-overlay').style.display = 'none';
    document.getElementById('game-mode').textContent = 'PHASE 2: Number Mode';
    resetGame();
}

function switchToXOMode() {
    switchToPhase(3);
    gameMode = 'xo';
    currentPHASE = 3;
    document.getElementById('phase3-overlay').style.display = 'none';
    document.getElementById('game-mode').textContent = 'PHASE 3: X/O Mode';
    resetGame();
}

function switchToIsomorphicMode() {
    switchToPhase(4);
    gameMode = 'isomorphic';
    currentPHASE = 4;
    document.getElementById('phase4-overlay').style.display = 'none';
    document.getElementById('game-mode').textContent = 'PHASE 4: Combined Mode';
    resetGame();
}

function resetGame() {
    availableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    playerNumbers = [];
    computerNumbers = [];
    gameStatus.textContent = '';
    boardElement.classList.remove('game-over');
    createBoard();
}

window.addEventListener('load', () => switchToPhase(1));

createBoard();