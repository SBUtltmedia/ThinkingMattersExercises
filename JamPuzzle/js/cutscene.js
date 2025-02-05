const dialogues = [
  {
    "speaker": "QUEEN",
    "text": "I'm sure I'll take you with pleasure! Two pence a week, and jam every other day."
  },
  {
    "speaker": "ALICE",
    "text": "I don't want you to hire me – and I don't care for jam.",
    "action": "laughing"
  },
  {
    "speaker": "QUEEN",
    "text": "It's very good jam."
  },
  {
    "speaker": "ALICE",
    "text": "Well, I don't want any to-day, at any rate."
  },
  {
    "speaker": "QUEEN",
    "text": "You couldn't have it if you did want it. The rule is, jam to-morrow and jam yesterday – but never jam to-day."
  },
  {
    "speaker": "ALICE",
    "text": "It must come sometimes to 'jam to-day'."
  },
  {
    "speaker": "QUEEN",
    "text": "No, it can't. It's jam every other day: to-day isn't any other day, you know."
  },
  {
    "speaker": "ALICE",
    "text": "I don't understand you. It's dreadfully confusing!"
  }
]

let currentDialogueIndex = 0;

const char1 = document.getElementById("alice");
const char2 = document.getElementById("queen");
const dialogueText = document.getElementById("dialogue-text");
const nextButton = document.getElementById("next-button");
const startButton = document.getElementById("start-button");
const audioButton = document.getElementById("audio-button");
const skipButton = document.getElementById("skip-button");
const cutsceneDiv = document.getElementById("cutscene");
const gameDiv = document.getElementById("game");

startButton.classList.add("hidden");
let turn = 0;
let audioInstances = [];
let dialogueInterval;

function updateDialogue() {
  const { speaker, text } = dialogues[currentDialogueIndex];
  console.log(turn);
  if (currentDialogueIndex % 2 == 0 & currentDialogueIndex > 0) {
    console.log('next turn');
    turn++;
  }

  // Update dialogue text
  dialogueText.textContent = text;
  playAudio(speaker, turn);

  // Highlight the active character
  if (speaker.toLowerCase() === "alice") {
    char1.classList.add("active");
    char2.classList.remove("active");
  } else {
    char2.classList.add("active");
    char1.classList.remove("active");
  }
}


function playAudio(speaker, index) {
  const audio = new Audio(`./assets/audio/${speaker.toLowerCase()}_${index}.wav`);
  audioInstances.push(audio); // Add the new audio instance to the array
  audio.play();
}

function stopAllAudio() {
  // Stop all active audio instances
  audioInstances.forEach(audio => audio.pause());
  audioInstances = []; // Clear the array
}

function runDialogue(){
  dialogueInterval = setInterval(function() {
    if (currentDialogueIndex < dialogues.length) {
      updateDialogue();
    } else {
      startButton.classList.toggle("hidden");
      skipButton.classList.toggle("hidden");
    }
    currentDialogueIndex++;
  }, 7000);
}

[startButton, skipButton].forEach(function (element) {
  element.addEventListener("click", () => {
    stopAllAudio();
    clearInterval(dialogueInterval); 
    cutsceneDiv.classList.toggle('hidden');
    gameDiv.classList.toggle('hidden');
    startGame();
  })
});




// Initialize dialogue
runDialogue();
