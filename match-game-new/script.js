const draggableListItems = document.querySelectorAll('.draggable-list li');
const endMessage = document.getElementById('endMessage');

// current phrase being dragged
let selectedId;

// target phrase
let dropTargetId;

// counter for correct phrases
let matchingCounter = 0;

addEventListeners();

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
  } else if (checkForMatch2(selectedId, dropTargetId)) {
    document.getElementById(selectedId).style.display = 'none';
    document.getElementById(dropTargetId).style.display = 'none';
    matchingCounter++;
  }

  if (matchingCounter === 5) {
    endMessage.style.display = 'block';
  }

  this.classList.remove('over');
}

function checkForMatch(selected, dropTarget) {
  switch (selected) {
    case 'e1':
      return dropTarget === 's1' ? true : false;

    case 'e2':
      return dropTarget === 's2' ? true : false;

    case 'e3':
      return dropTarget === 's3' ? true : false;

    case 'e4':
      return dropTarget === 's4' ? true : false;

    case 'e5':
      return dropTarget === 's5' ? true : false;

    default:
      return false;
  }
}

function checkForMatch2(selected, dropTarget) {
  switch (selected) {
    case 's1':
      return dropTarget === 'e1' ? true : false;

    case 's2':
      return dropTarget === 'e2' ? true : false;

    case 's3':
      return dropTarget === 'e3' ? true : false;

    case 's4':
      return dropTarget === 'e4' ? true : false;

    case 's5':
      return dropTarget === 'e5' ? true : false;

    default:
      return false;
  }
}

function playAgain() {
  matchingCounter = 0;
  endMessage.style.display = 'none';
  draggableListItems.forEach(item => {
    document.getElementById(item.id).style.display = 'block';
  })
}

function addEventListeners() {
  draggableListItems.forEach (item => {
    item.addEventListener('dragstart', dragStart);
    item.addEventListener('dragenter', dragEnter);
    item.addEventListener('drop', dragDrop);
    item.addEventListener('dragover', dragOver);
    item.addEventListener('dragleave', dragLeave);
  })
}


function generateSymbolBlock(desc) {
    let symbols = {'forevermore': 'square', 'all_pasts': 
    'square', 'eventually': 'diamond', 'some_past': 'diamond', 'tomorrow': 'triangle', 'yesterday': 'triangle', 'if':'arrow', 'or': 'or', 'and': 'and', 'not':'not', 'l':'left-paren', 'r': 'right-paren'}

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
        let answerBlock = Object.assign(document.createElement('li'), {'textContent': answer, 'draggable':true, 'id':`s${index+1}`})
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
        document.querySelectorAll('.draggable-list')[0].appendChild(symbolBlock);
    });
}


async function startGame() {
    // Create symbol blocks && answer blocks
    const data = await fetch('match.json')
    const response = await data.json();
    const set = response['problem_sets']['alice'];

    const questions = set['questions'];
    const answers = set['answers'];
    await generateAnswerBlocks(answers);
    await generateQuestionBlocks(questions);

}

startGame();