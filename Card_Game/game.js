const urlParams = new URLSearchParams(window.location.search);
let phase = Math.min(urlParams.get('phase') || 1, 4);

const phaseInfo = [
    { 
        'description': 'PHASE 1: HOT', 
        'instructions': 'Players take turns choosing cards from a set of nine, each containing a word. The objective is to be the first to collect three cards with words that share a common letter.' 
    },
    { 
        'description': 'PHASE 2: ACE', 
        'instructions': 'Players take turns choosing cards numbered Ace through 9. The objective is to be the first to collect three cards whose sum equals 15.' 
    },
    { 
        'description': 'PHASE 3: Tic-Tac-Toe', 
        'instructions': 'Players take turns placing Xs and Os on a standard 3×3 Tic-Tac-Toe board. The objective is to be the first to get three of your marks in a row - horizontally, vertically or diagonally, while strategically blocking your opponent.' 
    },
    { 
        'description': 'PHASE 4: Magic Square', 
        'instructions': 'This phase combines elements from the previous games. Players must recognize connections between words, numbers and patterns to form winning strategies. The key lies in identifying relationships, such as how three words sharing a common letter in "Hot" correspond to a sum of 15 in "Ace".' 
    }
];


// Ensure DOM is fully loaded before switching phase and showing instructions
window.addEventListener('DOMContentLoaded', () => {
    setupUI()
    switchToPhase(phase);

    // Ensure modal is shown only after elements are available
    const modal = document.getElementById('instructions-modal');
    // if (modal && phase <= 3) {
    //     showInstructions(phase); 
    // }
    
});

{/* <div class="phase-overlay" id="phase2-overlay">
<button class="phase-button" onclick="switchToPhase(2)">PHASE 2: Number Mode</button>
</div> */}

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
let currentPHASE = 1;
const boardElement = document.getElementById('board');
const gameStatus = document.getElementById('gameStatus');

function createBoard(phase) {
    boardElement.innerHTML = '';
    boardElement.classList.toggle('grid-layout', phase === 3 || phase === 4);
    
    const magicSquareOrder = [2, 7, 6, 9, 5, 1, 4, 3, 8];
    magicSquareOrder.forEach(num => {
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

    switch(currentPHASE) {
        case 1:
        case 2:
            const currentContent = cell.textContent;
            cell.innerHTML = currentContent + `<span class="label">${player}</span>`;
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



function showPhaseTransition(phase) {
    setTimeout(() => {
        document.getElementById(`phase${phase}-overlay`).style.display = 'flex';
    }, 1000);
}


function switchToPhase(phase) {
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
    
    resetGame(phase);
    
    // Show instructions when phase changes (except for Phase 4)
    console.log("Current Phase:", phase);
    // if (phase !== 4) {
        showInstructions(phase);
    //}

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


function resetGame(phase) {
    availableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    playerNumbers = [];
    computerNumbers = [];
    gameStatus.textContent = '';
    boardElement.classList.remove('game-over');
    createBoard(phase);
}

createBoard(phase);