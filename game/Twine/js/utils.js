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

async function dialogueEngine(npc) {
  let selectedDialogue = dialogs[npc];
  let current = 0;

  // displays options for users
  const displayOptions = (selectedDialogue, current) => {
    return new Promise((resolve) => {
      let options = selectedDialogue[current]["options"];
      let optionsBox =  Object.assign(document.createElement("div"), {"className": "optionContainer"});
      document.getElementById("dialog").appendChild(optionsBox);
      options.forEach((option, index) => {
        let link = Object.assign(document.createElement("button"), {
          textContent: option.response,
        });
        link.addEventListener("click", () => {
          resolve(index); // Resolve the promise with the index of the selected option
        });
        optionsBox.appendChild(link);
      });
    });
  };

  while (current !== "end") {
    await new Promise((resolve) => {
      typeWriter(0, selectedDialogue[current]["text"], 50, resolve);
    });

    if(!selectedDialogue[current]["options"]) {
      // Clear the dialog content since it's done
      document.getElementById("dialog").innerHTML = '';
      return;
    }
    let selectedOptionIndex = await displayOptions(selectedDialogue, current);
    current = selectedDialogue[current]["options"][selectedOptionIndex].next; // Update current to the next dialogue index

    // Clear the dialog content for the next text
    document.getElementById("dialog").innerHTML = '';
  }
  return;
}
