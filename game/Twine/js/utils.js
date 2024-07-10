// function typeWriter(options= {i:0,txt:"no text provided",speed: 50,resolve,reject}) {

//     if (options.i < txt.length) {
//       document.getElementById("dialog").innerHTML += options.txt.charAt(i);
//       options.i++;
//       setTimeout(()=>typeWriter(options.i,options.txt,options.speed), options.speed);
//     }
// }

// function dialogEngine(npc) {
//     let dialogTree = dialogs[npc];
//     let next = 0;

//     while(next !== "end") {
//         // let myPromise= new Promise((reolve,reject)=>
//         // typeWriter(dialogTree[next]["text"])
//         console.log(dialogTree[next]["text"]);
//         const options = {txt: dialogTree[next]["text"]}
//         typeWriter(options)
//         break
//         // next = dialogTree[next]["next"];
//     }

// }

window.conversationRunning = false;

function overlaps(a, b) {
    const rect1 = a.getBoundingClientRect();
    const rect2 = b.getBoundingClientRect();
    const isInHoriztonalBounds =
        rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x;
    const isInVerticalBounds =
        rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y;
    const isOverlapping = isInHoriztonalBounds && isInVerticalBounds;
    return isOverlapping;
}

function typeWriter(i = 0, txt, speed = 50, callback) {
  if (i < txt.length) {
    document.getElementById("dialog").innerHTML += txt.charAt(i);
    i++;
    setTimeout(() => typeWriter(i, txt, speed, callback), speed);
  } else {
    if (callback) {
      // Signals typewriter is done
      callback();
    }
  }
}

function displayOptions(selectedDialogue, current, callback) {
    let options = selectedDialogue[current]["options"];
    let optionsBox =  Object.assign(document.createElement("div"), {"className": "optionContainer"});
    document.getElementById("dialog").appendChild(optionsBox);
    options.forEach((option, index) => {
    let link = Object.assign(document.createElement("button"), {
        textContent: option.response,
    });
    link.addEventListener("click", () => {
        console.log(index);
        callback(index); // Resolve the promise with the index of the selected option
    });
    optionsBox.appendChild(link);
    });
}

async function dialogueEngine(npc) {
  if(window.conversationRunning) {
    return;
  }
  window.conversationRunning = true;
  let selectedDialogue = dialogs[npc];
  let current = 0;

  while (current !== "end") {

    if(!overlaps(document.getElementById("player"),document.getElementById(npc))) {
        break;
    }

    await new Promise((resolve) => {
      typeWriter(0, selectedDialogue[current]["text"], 50, resolve);
    });

    if(!selectedDialogue[current]["options"]) {
      break;
    }
    let selectedOptionIndex = await new Promise((resolve)=> {displayOptions(selectedDialogue, current, resolve)});
    current = selectedDialogue[current]["options"][selectedOptionIndex].next; // Update current to the next dialogue index

    // Clear the dialog content for the next text
    document.getElementById("dialog").innerHTML = '';
  }
  document.getElementById("dialog").innerHTML = '';
  window.conversationRunning = false;
}
