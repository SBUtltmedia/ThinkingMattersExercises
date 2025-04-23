// Get the current phase from the URL (like ?phase=2) default to 1 and limit it to max 4
const urlParams = new URLSearchParams(window.location.search);
let phase = Math.min(urlParams.get('phase') || 1, 4);


let playerLetterCounts = {};
let computerLetterCounts = {};
const TRACKED_LETTERS = ['a', 'd', 'h', 'i', 'n', 'o', 's', 't'];


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
    switchToPhase(phase);
    resizeWindow();
    toggleLetterBoxesVisibility(phase);
    const modal = document.getElementById('instructions-modal');
});




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
let currentPHASE = 1;
const boardElement = document.getElementById('board');
const gameStatus = document.getElementById('gameStatus');
let gameEnded = false;
const userStatus = "Your Status";
const computerStatus = "Computer's Status";



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




// Function to proceed to the next phase on clicking "Next Phase" button
function proceedToNextPhase() {
    const nextPhase = Math.min(currentPHASE + 1, 4);
    document.getElementById('instructions-modal').style.display = 'none';
    document.getElementById('modal-buttons').style.display = 'none';

    switchToPhase(nextPhase);
}




// Function containign the logic to show the score on the board for phase 2
function renderPhase2Combinations(numbers, elementId) {
    if (currentPHASE !== 2 && urlParams.get('phase') !== '2') return;

    const container = document.getElementById(elementId);
    container.innerHTML = '';

    const title = document.createElement('div');
    title.className = 'letter-title';
    title.textContent = elementId === 'player-letters' ? userStatus : computerStatus;
    container.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'letter-grid';

    grid.style.display = numbers.length < 3 ? 'grid' : 'block';

    if (numbers.length === 3) {
        const [a, b, c] = numbers;
        const sum = a + b + c;
        const row = document.createElement('div');
        row.textContent = `${a} + ${b} + ${c} = ${sum}`;
        row.classList.toggle('blink', sum === targetSum);
        grid.appendChild(row);
    } else {
        grid.style.display = 'grid';
        for (let i = 0; i < numbers.length; i++) {
            for (let j = i + 1; j < numbers.length; j++) {
                for (let k = j + 1; k < numbers.length; k++) {
                    const a = numbers[i], b = numbers[j], c = numbers[k];
                    const row = document.createElement('div');
                    row.textContent = `${a} + ${b} + ${c} = ${a + b + c}`;
                    row.classList.toggle('blink', a + b + c === targetSum);
                    grid.appendChild(row);
                }
            }
        }
    }
    

    container.appendChild(grid);
}



// Handles what happens when the player clicks a cell
function handlePlayerMove(event) {
    if (gameEnded) return;

    const cell = event.target.closest('.cell');
    
    if (!cell || !availableNumbers.includes(parseInt(cell.dataset.number))) return;

    const number = parseInt(cell.dataset.number);
    playerNumbers.push(number);

    if (currentPHASE !== 2 && urlParams.get('phase') !== '2') {
        updateLetterCounts(wordBindings[number], playerLetterCounts, 'player-letters');
    }
    
    availableNumbers = availableNumbers.filter(num => num !== number);

    updateCellDisplay(cell, 'player');
    renderPhase2Combinations(playerNumbers, 'player-letters');



    if (checkWinningCombination(playerNumbers)) {
        showResult("Computer Wins!");
                if (currentPHASE === 4) {
            boardElement.classList.add('game-over');
        }
        endGame();
        return;
    }

    if (availableNumbers.length === 0) {
        showResult("It's a Tie!");
                if (currentPHASE === 4) {
            boardElement.classList.add('game-over');
        }
        endGame();
        return;
    }

    const bestMove = findBestMove();
    computerNumbers.push(bestMove);

    if (currentPHASE !== 2 && urlParams.get('phase') !== '2') {
        updateLetterCounts(wordBindings[bestMove], computerLetterCounts, 'computer-letters');
    }

    availableNumbers = availableNumbers.filter(num => num !== bestMove);

    const computerCell = document.querySelector(`[data-number="${bestMove}"]`);

    
    updateCellDisplay(computerCell, 'computer');
    renderPhase2Combinations(computerNumbers, 'computer-letters');


    if (checkWinningCombination(computerNumbers)) {
        showResult("Computer Wins!");
        if (currentPHASE === 4) {
            boardElement.classList.add('game-over');
        }
        endGame();
        return;
    }

    if (availableNumbers.length === 0) {
        showResult("It's a Tie!");
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




function toggleLetterBoxesVisibility(phase) {
    const playerBox = document.getElementById('player-letters');
    const computerBox = document.getElementById('computer-letters');

    const shouldHide = phase === 3 || phase === 4 || ['3', '4'].includes(urlParams.get('phase'));

    const displayValue = shouldHide ? 'none' : 'block';

    playerBox.style.display = displayValue;
    computerBox.style.display = displayValue;
}



// Function to update the letter counts for the player and computer
function updateLetterCounts(word, countObj, elementId) {
    for (let char of word.toLowerCase()) {
        if (!/[a-z]/.test(char)) continue;
        countObj[char] = (countObj[char] || 0) + 1;
    }
    renderLetterCounts(countObj, elementId);
}




function renderLetterCounts(countObj, elementId) {
    const container = document.getElementById(elementId);
    container.innerHTML = ''; 

    const title = document.createElement('div');
    title.className = 'letter-title';
    title.textContent = elementId === 'player-letters' ? userStatus : computerStatus;
    container.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'letter-grid';

    for (let letter of TRACKED_LETTERS) {
        const value = countObj[letter] || 0;
        const cell = document.createElement('div');
        cell.className = 'letter-cell';
        cell.textContent = `${letter}-${value}`;

        cell.className = `letter-cell${value === 2 ? ' blink' : ''}`;


        grid.appendChild(cell);
    }
    container.appendChild(grid);
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




// When the game ends
function endGame() {
    gameEnded = true;

    const urlPhase = urlParams.get('phase');

    if (urlPhase) {
        return;
    }
}




// Function to switch to a specific phase without the modal code
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

    // document.getElementById(`phase${phase}-overlay`).style.display = 'none';
    gameModeElement.textContent = phaseInfo[phase - 1].description;
    
    resetGame(currentPHASE);


    toggleLetterBoxesVisibility(currentPHASE);
    
    // Show instructions when phase changes
    showInstructions(phase);

}



// Function to handle the "Play Again" button
function handlePlayAgain() {
    document.getElementById('instructions-modal').style.display = 'none';
    resetGame(currentPHASE);
}




// Function to Display Instructions Modal
function showInstructions(phase) {
    const modal = document.getElementById('instructions-modal');
    const title = document.getElementById('modal-title');
    const text = document.getElementById('modal-text');
    // const closeButton = document.querySelector('.close-button');
    const buttons = document.getElementById('modal-buttons');


    title.textContent = phaseInfo[phase - 1].description;
    text.textContent = phaseInfo[phase - 1].instructions;

    modal.style.display = 'flex';

    // Close modal when clicking the close button
    document.querySelector('.close-button').onclick = () => {
        modal.style.display = 'none';
    };
}




// Function to hide the next phase button whenever needed
function hideNextPhaseButton(phase) {
    const nextPhaseButton = document.querySelector('#modal-buttons button:last-child');
    if (!nextPhaseButton) return;

    nextPhaseButton.style.display = 'none';
}



// Function to show the result of the game
function showResult(message) {
    const modal = document.getElementById('instructions-modal');
    const title = document.getElementById('modal-title');
    const text = document.getElementById('modal-text');
    const buttons = document.getElementById('modal-buttons');

    title.textContent = message;
    text.textContent = '';
    // text.textContent = "Would you like to play again or move on to the next phase?";
    buttons.style.display = 'flex';


    currentPHASE === 4 && hideNextPhaseButton(currentPHASE);
    urlParams.has('phase') && hideNextPhaseButton(currentPHASE);



    modal.style.display = 'flex';
}




// Function to reset the game for the current phase
function resetGame(passPhase) {
    gameEnded = false;
    playerLetterCounts = {};
    computerLetterCounts = {};

    TRACKED_LETTERS.forEach(letter => {
        playerLetterCounts[letter] = 0;
        computerLetterCounts[letter] = 0;
    });

    renderLetterCounts(playerLetterCounts, 'player-letters');
    renderLetterCounts(computerLetterCounts, 'computer-letters');

    availableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    playerNumbers = [];
    computerNumbers = [];

    if (passPhase === 2 || urlParams.get('phase') === '2') {
        renderPhase2Combinations(playerNumbers, 'player-letters');
        renderPhase2Combinations(computerNumbers, 'computer-letters');
    }
    gameStatus.textContent = '';
    boardElement.classList.remove('game-over');
    createBoard(passPhase);
}