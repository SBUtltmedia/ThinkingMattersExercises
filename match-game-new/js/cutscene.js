const dialogues = [
    { speaker: "char1", text: "Hello, welcome to the adventure!" },
    { speaker: "char2", text: "Thanks! I'm excited to start." },
    { speaker: "char1", text: "Let's work together to complete our quest." },
    { speaker: "char2", text: "Alright, lead the way!" }
];
  
let currentDialogueIndex = 0;

const char1 = document.getElementById("char1");
const char2 = document.getElementById("char2");
const dialogueText = document.getElementById("dialogue-text");
const nextButton = document.getElementById("next-button");
const startButton = document.getElementById("start-button");
const cutsceneDiv = document.getElementById("cutscene");
const gameDiv = document.getElementById("game");

startButton.classList.add("hidden");

function updateDialogue() {
  const { speaker, text } = dialogues[currentDialogueIndex];

  // Update dialogue text
  dialogueText.textContent = text;

  // Highlight the active character
  if (speaker === "char1") {
    char1.classList.add("active");
    char2.classList.remove("active");
  } else {
    char2.classList.add("active");
    char1.classList.remove("active");
  }
}

nextButton.addEventListener("click", () => {
  currentDialogueIndex++;

  if (currentDialogueIndex < dialogues.length) {
    updateDialogue();
  } else {
    startButton.classList.toggle("hidden");
    nextButton.classList.toggle("hidden");
  }
});


startButton.addEventListener("click", () => {
    cutsceneDiv.classList.toggle('hidden');
    gameDiv.classList.toggle('hidden');
    startGame();
});

// Initialize dialogue
updateDialogue();
  