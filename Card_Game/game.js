// Get the current phase from the URL (like ?phase=2) default to 1 and limit it to max 4
const urlParams = new URLSearchParams(window.location.search);
let phase = Math.min(urlParams.get('phase') || 1, 4);


//Hi hat in dough and tides not as so
// Game instructions for each of the 4 phases
const phaseInfo = [
    { 
        'description': 'Phase 1: Hot', 
        'instructions': 'Players take turns choosing cards from a set of nine, each containing a word. The objective is to be the first to collect three cards with words that share a common letter.' 
    },
    { 
        'description': 'Phase 2: Ace', 
        'instructions': 'Players take turns choosing cards numbered 1 through 9. The objective is to be the first to collect three cards whose sum equals 15.' 
    },
    { 
        'description': 'Phase 3: Tic-Tac-Toe', 
        'instructions': 'Players take turns placing Xs and Os on a standard 3×3 Tic-Tac-Toe board. The objective is to be the first to get three of your marks in a row - horizontally, vertically or diagonally, while strategically blocking your opponent.' 
    },
    { 
        'description': 'Phase 4: Magic Square', 
        'instructions': 'This phase combines elements from the previous games. Players must recognize connections between words, numbers and patterns to form winning strategies. The key lies in identifying relationships, such as how three words sharing a common letter in the game "Hot" correspond to a sum of 15 in "Ace".' 
    }
];




// Ensure DOM is fully loaded before switching phase and showing instructions
window.addEventListener('DOMContentLoaded', () => {
    setupUI()
    switchToPhase(phase);

    const modal = document.getElementById('instructions-modal');
});




// Create clickable buttons for each phase
function setupUI(){
    for (const [i,val] of phaseInfo.entries()){
        console.log("here",i+1)
        let phaseOverlay = Object.assign(document.createElement('div'),
        {className: "phase-overlay", 
            id: `phase${i+1}-overlay`
        })
    
        let phaseButton = Object.assign(document.createElement('button'),
        {   className: "phase-button", 
            innerHTML: val["description"]
        })
        phaseButton.addEventListener("click", () => switchToPhase(i + 1));
    
        phaseOverlay.appendChild(phaseButton)
        document.getElementsByTagName("body")[0].appendChild(phaseOverlay)
    }

}


const targetSum = 15;
const wordBindings = {
    2: "hat",
    7: "hi",
    6: "dough",
    9: "as",
    5: "tides",
    1: "so",
    4: "and",
    3: "in",
    8: "not",
};
let availableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let playerNumbers = [];
let computerNumbers = [];
let gamesPlayed = 0;
let currentPHASE = 1;
const boardElement = document.getElementById('board');
const gameStatus = document.getElementById('gameStatus');



// Draw the board depending on the current phase
function createBoard(phase) {
    boardElement.innerHTML = '';
    boardElement.classList.toggle('grid-layout', phase === 3 || phase === 4);
    
    const wordOrder = [7, 2, 3, 6, 4, 5, 8, 9, 1];
    const magicSquareOrder = [2, 7, 6, 9, 5, 1, 4, 3, 8];

    const displayOrder = (phase === 1) ? wordOrder : magicSquareOrder;

    displayOrder.forEach(num => {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.number = num;
        
        switch(phase) {
            case 1:
                cell.textContent = wordBindings[num];
                break;
            case 2:
                cell.textContent = num;
                break;
            case 3:
                cell.classList.add('xo-cell');
                break;
            case 4:
                cell.classList.add('isomorphic-cell');
                cell.innerHTML = `
                    <div class="main-symbol"></div>
                    <div class="sub-info">
    <span class="cell-number">${num}</span>
    <span class="cell-word">${wordBindings[num]}</span>
                    </div>
                `;
                break;
        }
        
        // Make each cell clickable
        cell.addEventListener('click', handlePlayerMove);
        boardElement.appendChild(cell);
    });
}



// Handles what happens when the player clicks a cell
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



// Show "X" or "O" or label when a cell is clicked
function updateCellDisplay(cell, player) {
    cell.classList.add(`taken-${player}`);
    const symbol = player === 'player' ? 'X' : 'O';

    switch(currentPHASE) {
        case 1:
        case 2:
            const currentContent = cell.textContent;
            cell.innerHTML = currentContent + `<span class="label ${player}">${player}</span>`;
            break;
        case 3:
            cell.textContent = symbol;
            break;
        case 4:
            const mainSymbol = cell.querySelector('.main-symbol');
            mainSymbol.textContent = symbol;
            break;
    }
    
    cell.removeEventListener('click', handlePlayerMove);
}



// Method to check if any 3 numbers add up to 15
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



// Returns score based on who is winning
function evaluate() {
    if (checkWinningCombination(computerNumbers)) return 10;
    if (checkWinningCombination(playerNumbers)) return -10;
    return 0;
}


// Try all moves and pick best one using minimax algorithm
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



// Loop through all moves and return the best move for computer
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



// When game ends, move to next phase if no phase in URL, if phase="x" in URL, do nothing
function endGame() {
    gamesPlayed++;

    const urlPhase = urlParams.get('phase'); // Get phase from URL (null if not present)

    if (urlPhase) {
        return;
    }

    if (currentPHASE === 1) {
        currentPHASE = 2;  // Move to Phase 2
        showPhaseTransition(2);
    } else if (currentPHASE === 2) {
        currentPHASE = 3;  // Move to Phase 3
        showPhaseTransition(3);
    } else if (currentPHASE === 3) {
        currentPHASE = 4;  // Move to Phase 4
        showPhaseTransition(4);
    }
}



// Show phase transition overlay when switching to a new phase
function showPhaseTransition(phase) {
    setTimeout(() => {
        document.getElementById(`phase${phase}-overlay`).style.display = 'flex';
    }, 1000);
}



// Function to switch to a specific phase
function switchToPhase(phase) {
    currentPHASE = phase;

    const gameModeElement = document.getElementById('game-mode');
    const board = document.querySelector('.board');
    
    gameModeElement.style.animation = 'none';
    board.classList.remove('show');
    
    void gameModeElement.offsetWidth;
    
    gameModeElement.style.animation = 'phaseEntrance 1.5s ease-out forwards';
    
    setTimeout(() => {
        board.classList.add('show');
    }, 1000);

    document.getElementById(`phase${phase}-overlay`).style.display = 'none';
    gameModeElement.textContent = phaseInfo[phase - 1].description;
    
    resetGame(currentPHASE);
    
    // // Show instructions when phase changes (except for Phase 4)
        showInstructions(phase);

}



// Function to Display Instructions Modal
function showInstructions(phase) {
    const modal = document.getElementById('instructions-modal');
    const title = document.getElementById('modal-title');
    const text = document.getElementById('modal-text');
    const closeButton = document.querySelector('.close-button');

    title.textContent = phaseInfo[phase - 1].description;
    text.textContent = phaseInfo[phase - 1].instructions;

    modal.style.display = 'flex';

    // Close modal when clicking the close button
    closeButton.onclick = () => {
        modal.style.display = 'none';
    };
}



// Function to reset the game for the current phase
function resetGame(passPhase) {
    availableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    playerNumbers = [];
    computerNumbers = [];
    gameStatus.textContent = '';
    boardElement.classList.remove('game-over');
    createBoard(passPhase);
}

// createBoard(phase);