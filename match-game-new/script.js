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
  draggableListItems.forEach(item => {
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
  if (!showModal) {
    showModal = Object.assign(document.createElement('button'), { 'className': "show-modal", 'textContent': "Show Button" });
    showModal.addEventListener('click', function (e) {
      endMessage.style.display = 'block';
    })
    document.querySelector('.container').appendChild(showModal);
  }
}


function generateSymbolBlock(desc) {
  let symbols = {
    'forevermore': 'square', 'all_pasts':
      'square', 'eventually': 'diamond', 'some_past': 'diamond', 'tomorrow': 'triangle', 'yesterday': 'triangle', 'if': 'arrow', 'or': 'or', 'and': 'and', 'not': 'not', 'l': 'left-paren', 'r': 'right-paren'
  }

  if (!(desc in symbols)) {
    console.log('not a symbol')
    return Object.assign(document.createElement('span'), { 'textContent': 'J' });
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
        let answerBlock = Object.assign(document.createElement('li'), {'textContent': answer.text, 'draggable':true, 'id':`a${answer.question}`})
        // document.querySelectorAll('.draggable-list')[1].appendChild(answerBlock);
        blocks.push(answerBlock);
    })
    const shuffled = shuffleArray(blocks);

    shuffled.forEach(block => {
      document.querySelectorAll('.draggable-list')[1].appendChild(block);
    })
    return;
}

function generateQuestionBlocks(questions) {
  questions.forEach((question, index) => {
    let description = question.split(" ");
    let symbolBlock = Object.assign(document.createElement('li'), { 'draggable': true })
    description.forEach((desc, index) => {
      symbolBlock.appendChild(generateSymbolBlock(desc));
    })
    // symbolBlock.id = `s${document.querySelectorAll('.draggable-list')[0].childElementCount + 1};`
    symbolBlock.id = `s${index + 1}`
    document.querySelectorAll('.draggable-list')[0].appendChild(symbolBlock);
  });
}

function animateCat(answer) {
  let cat = document.querySelector('#cat');
  if (answer === false) {
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
  if (text === 'clear') {
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
    setTimeout(() => showIntroduction(index + 1), 1000);
  } else {
    displayText('clear');
    // displaySymbolsAndMeanings();
  }
}

function displaySymbolsAndMeanings() {
  let symbolsContainer = document.querySelector('#symbols2');

  const data = [
    {
      past: { svg: '<use href="./icons.svg#square"></use>', description: "Always happened in the past", class: "all_pasts" },
      future: { svg: '<use href="./icons.svg#square"></use>', description: "Always going to happen in the future", class: "forevermore" }
    },
    {
      past: { svg: '<use href="./icons.svg#diamond"></use>', description: "At some time in the past", class: "some_past" },
      future: { svg: '<use href="./icons.svg#diamond"></use>', description: "At some time in the future", class: "eventually" }
    },
    {
      past: { svg: '<use href="./icons.svg#triangle"></use>', description: "Yesterday", class: "yesterday" },
      future: { svg: '<use href="./icons.svg#triangle"></use>', description: "Tomorrow", class: "tomorrow" }
    }
  ];

  // Create table elements
  const table = document.createElement("table");
  table.className = "symbol-table";
  // table.id = "symbols2";

  // Create table header
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  const thPast = document.createElement("th");
  thPast.textContent = "Past";
  headerRow.appendChild(thPast);

  const thFuture = document.createElement("th");
  thFuture.textContent = "Future";
  headerRow.appendChild(thFuture);

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create table body
  const tbody = document.createElement("tbody");

  // Loop over data to create rows
  data.forEach(rowData => {
    const row = document.createElement("tr");

    // Past cell
    const pastCell = document.createElement("td");
    const pastSVG = generateSymbolBlock(rowData.past.class);
    const pastText = Object.assign(document.createElement("span"), {'textContent': ` - ${rowData.past.description}`});
    // pastText.textContent = rowData.past.description;

    pastCell.appendChild(pastSVG);
    pastCell.appendChild(pastText);
    row.appendChild(pastCell);

    // Future cell
    const futureCell = document.createElement("td");
    const futureSVG = generateSymbolBlock(rowData.future.class);
    const futureText = Object.assign(document.createElement("span"), {'textContent': ` - ${rowData.future.description}`})
    // futureText.textContent = rowData.future.description;

    futureCell.appendChild(futureSVG);
    futureCell.appendChild(futureText);
    row.appendChild(futureCell);

    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  symbolsContainer.appendChild(table);
}

function displayLogicSymbols() {
  const symbolsContainer = document.querySelector('#symbols2');
  // const symbols = {
  //   'if': 'arrow', 'or': 'or', 'and': 'and', 'not': 'not', 'l': 'left-paren', 'r': 'right-paren'
  // }

  const symbols = ['if', 'or', 'and', 'not'];

  // Create table elements
  const table = document.createElement("table");
  table.className = "symbol-table";
  // table.id = "symbols2";

  // Create table header
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  const th = document.createElement("th");
  th.textContent = "Logic Symbols";
  th.setAttribute("colspan", "2"); // Make header span across 2 columns
  th.style.textAlign = "center"; // Center-align the header text

  headerRow.appendChild(th);
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create table body
  const tbody = document.createElement("tbody");

  for (let i = 0; i < symbols.length; i += 2) {
    const row = document.createElement("tr");

    const cell = document.createElement("td");
    const svg = generateSymbolBlock(symbols[i]);
    const text = Object.assign(document.createElement("span"), { 'textContent': ` - ${symbols[i]}` });

    cell.appendChild(svg);
    cell.appendChild(text);
    row.appendChild(cell);

    // Second cell (if there is a next symbol)
    const cell2 = document.createElement("td");
    if (symbols[i + 1]) {
      const svg2 = generateSymbolBlock(symbols[i + 1]);
      const text2 = document.createElement("span");
      text2.textContent = ` - ${symbols[i + 1]}`;

      cell2.appendChild(svg2);
      cell2.appendChild(text2);
    }
    row.appendChild(cell2);

    tbody.appendChild(row);

    // let symbolBlock = Object.assign(document.createElement('div'), {'textContent': `${key} - `, 'className': 'symbol-box'});
    // symbolBlock.appendChild(generateSymbolBlock(key));
    // symbolsContainer.appendChild(symbolBlock);
  }
  table.appendChild(tbody);
  symbolsContainer.appendChild(table);

}


function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


async function startGame() {
  // showIntroduction(0);
  // Create symbol blocks && answer blocks
  const data = await fetch('match.json')
  const response = await data.json();
  const set = response['problem_sets']['alice'];

  const questions = set["answers"].map(question => question.symbolism);
  const answers = set['answers'];
  displaySymbolsAndMeanings();
  displayLogicSymbols()
  generateAnswerBlocks(answers);
  generateQuestionBlocks(questions);
  addEventListeners();

}

startGame();


/* TODO:
Symbol showing in forms of a hint?

*/