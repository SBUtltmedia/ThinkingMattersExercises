// const draggableListItems = document.querySelectorAll('.draggable-list li');
const endMessage = document.getElementById('endMessage');

// current phrase being dragged
let selectedId;

// target phrase
let dropTargetId;

// counter for correct phrases
let matchingCounter = 0;

let draggableListItems;
function dragStart() {
  selectedId = this.id;
}

function dragEnter() {
  this.classList.add('over');
}

function dragLeave() {
  this.classList.remove('over');
}

function dragOver(ev) {
  ev.preventDefault();
}

function dragDrop() {
  dropTargetId = this.id;
  if (checkForMatch(selectedId, dropTargetId)) {
    document.getElementById(selectedId).style.display = 'none';
    document.getElementById(dropTargetId).style.display = 'none';
    matchingCounter++;
  }

  if (matchingCounter === Math.floor(draggableListItems.length / 2)) {
    endMessage.style.display = 'block';
  }

  this.classList.remove('over');
}

function checkForMatch(selected, dropTarget) {
  if (selected === dropTarget) {
    return;
  }
  let match = selected[1] === dropTarget[1];
  animateCat(match);
  return match;
  // if(selected[1] === dropTarget[1]) {
  //   return true;
  // }
  // animateCat(false);
  // return false;
}


function playAgain() {
  matchingCounter = 0;
  endMessage.style.display = 'none';
  document.querySelector('.show-modal').remove();
  draggableListItems.forEach(item => {
    document.getElementById(item.id).style.display = 'block';
  })
}

function addEventListeners() {
  draggableListItems = document.querySelectorAll('.draggable-list li');
  draggableListItems.forEach (item => {
    item.addEventListener('dragstart', dragStart);
    item.addEventListener('dragenter', dragEnter);
    item.addEventListener('drop', dragDrop);
    item.addEventListener('dragover', dragOver);
    item.addEventListener('dragleave', dragLeave);
  })
}

function closeModal() {
  endMessage.style.display = 'none';
  let showModal = document.querySelector('.show-modal');
  console.log(showModal);
  if(!showModal) {
  showModal = Object.assign(document.createElement('button'), {'className':"show-modal", 'textContent': "Show Button"});
    showModal.addEventListener('click', function (e) {
      endMessage.style.display = 'block';
    })
  document.querySelector('.container').appendChild(showModal);
  }
}


function generateSymbolBlock(desc) {
    let symbols = {'forevermore': 'square', 'all_pasts': 
    'square', 'eventually': 'diamond', 'some_past': 'diamond', 'tomorrow': 'triangle', 'yesterday': 'triangle', 'if':'arrow', 'or': 'or', 'and': 'and', 'not':'not', 'l':'left-paren', 'r': 'right-paren'}

    if(!(desc in symbols)) {
      console.log('not a symbol')
      return Object.assign(document.createElement('span'), {'textContent': 'A'});
    } 
    var ns = 'http://www.w3.org/2000/svg'
    let svg = document.createElementNS(ns, 'svg')
    let use = document.createElementNS(ns, 'use')
    use.setAttributeNS(null, 'href', `./icons.svg#${symbols[desc]}`)
    use.setAttribute('class', desc)
    svg.appendChild(use);
    return svg;
}


function generateAnswerBlocks(answers) {
    let blocks = [];
    answers.forEach((answer, index) => {
        let answerBlock = Object.assign(document.createElement('li'), {'textContent': answer, 'draggable':true, 'id':`a${index+1}`})
        document.querySelectorAll('.draggable-list')[1].appendChild(answerBlock);
    })
    return blocks;
}

function generateQuestionBlocks(questions) {
    questions.forEach(question => {
        let description = question.split(" ");
        let symbolBlock = Object.assign(document.createElement('li'), {'draggable':true})
        description.forEach((desc, index) => {
        symbolBlock.appendChild(generateSymbolBlock(desc));
         })
        symbolBlock.id = `s${document.querySelectorAll('.draggable-list')[0].childElementCount + 1};`
        document.querySelectorAll('.draggable-list')[0].appendChild(symbolBlock);
    });
}

function animateCat(answer) {
  let cat = document.querySelector('#cat');
  if(answer === false) {
    console.log('cat taunts')
    cat.classList.add('taunt');
    cat.addEventListener('animationend', (event) => {
      cat.classList.remove('taunt');
    })
  } else {
    console.log('Correct')
    cat.classList.add('damage');
    cat.addEventListener('animationend', (event) => {
      cat.classList.remove('damage');
    })
  }
}

function displayText(text) {
  let catMessage = document.querySelector('#cat-message');
  if(text==='clear') {
    catMessage.style.visibility = 'hidden';
    return;
  }
  catMessage.textContent = text;
}


function showIntroduction(index) {
  console.log(index);
    let messages = ['Hello', 'My name is whatever you want it to be.', 'It doesnt matter who I am.', 'But you have to finish the game', 'Good luck!']
    if (index < messages.length) {
      displayText(messages[index]);
      setTimeout(() => showIntroduction(index+1), 1000);
    } else {
      displayText('clear');
      // displaySymbolsAndMeanings();
    }
}

function displaySymbolsAndMeanings() {
  let symbolsContainer = document.querySelector('#symbols');

  let symbols = {'forevermore': 'square', 'all_pasts': 
    'square', 'eventually': 'diamond', 'some_past': 'diamond', 'tomorrow': 'triangle', 'yesterday': 'triangle', 'if':'arrow', 'or': 'or', 'and': 'and', 'not':'not'}
  
  for (const [key, value] of Object.entries(symbols)) {
    let symbolBlock = Object.assign(document.createElement('div'), {'textContent': `${key} - `, 'className': 'symbol-box'});
    symbolBlock.appendChild(generateSymbolBlock(key));
    symbolsContainer.appendChild(symbolBlock);
  }

}


async function startGame() {
    // showIntroduction(0);
    // Create symbol blocks && answer blocks
    const data = await fetch('match.json')
    const response = await data.json();
    const set = response['problem_sets']['alice'];

    const questions = set['questions'];
    const answers = set['answers'];
    displaySymbolsAndMeanings();
    generateAnswerBlocks(answers);
    generateQuestionBlocks(questions);
    addEventListeners();

}

startGame();


/* TODO:
Symbol showing in forms of a hint?

*/