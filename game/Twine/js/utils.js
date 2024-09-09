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

function addCharacter(characterID) {
  let walkway = document.getElementById("walkway");
  // console.log(walkway);
  npc = Object.assign(document.createElement("div"),{id:characterID, className:"collidable"});
  walkway.append(npc);
}

function typeWriter(txt,  i = 0, speed = 50, callback=()=>{}) {
  console.log('typing');
  if (i < txt.length) {
    document.getElementById("dialog").innerHTML += txt.charAt(i);
    i++;
    setTimeout(() => typeWriter(txt,  i , speed, callback), speed);
  } else {
    if (callback) {
      // Signals typewriter is done
      callback();
    }
  }
}

function displayOptions(npc, selectedDialogue, current, callback) {
    let options = selectedDialogue[current]["options"];
    let optionsBox =  Object.assign(document.createElement("div"), {"className": "optionContainer"});
    document.getElementById("dialog").appendChild(optionsBox);
    options.forEach((option, index) => {
    let link = Object.assign(document.createElement("button"), {
        textContent: option.response,
    });
    link.addEventListener("click", () => {
        console.log(index);
        let history = SugarCube.State.getVar("$history") || {};
        let currentSpeaker = history[npc] || {};
        currentSpeaker["picked"] = currentSpeaker["picked"] || [];
        currentSpeaker["picked"][current] = index;
        currentSpeaker["currentDialogueId"] = option.next;
        // currentSpeaker.push(current);
        history[npc] = currentSpeaker;
        SugarCube.State.setVar("$history", history);
        callback(index); // Resolve the promise with the index of the selected option
    });
    optionsBox.appendChild(link);
    });
}

// history :{
//   godel_0:{
//     lastDialogueId: 0,
//     picked: []
//   }
// }

async function dialogueEngine(npc) {
  // let selectedDialogue = dialogs[npc];
  let res =  await fetch('./data.json');
  let allDialogue = await res.json();
  let selectedDialogue = allDialogue[npc]["dialogue"];
  let current = 0;
  let playerHistory = SugarCube.State.getVar("$history") || {};
  
  if(playerHistory[npc]?.currentDialogueId) { 
    current = playerHistory[npc].currentDialogueId;
  }
  

  // let current = 0;

  while (current !== "end") {
    console.log("current ", current);
    showVideo(npc, current)
    showCaptions();

    // await new Promise((resolve) => {
    //   typeWriter(0, selectedDialogue[current]["text"], 50, resolve);
    // });

    if(!selectedDialogue[current]["options"]) {
      break;
    }
    let selectedOptionIndex = await new Promise((resolve)=> {displayOptions(npc, selectedDialogue, current, resolve)});
    current = selectedDialogue[current]["options"][selectedOptionIndex].next; // Update current to the next dialogue index

    // Clear the dialog content for the next text
    document.getElementById("dialog").innerHTML = '';
  }
  document.getElementById("dialog").innerHTML = '';
  window.conversationRunning = false;
}

function showVideo(npc, current) {
  let videoContainer = document.querySelector('#videoContainer');
    
  if(!videoContainer) {
    videoContainer = Object.assign(document.createElement("div"), {id: "videoContainer"});
    document.querySelector("#dialog").append(videoContainer);
  }

  let video = document.createElement('video');
  video.src = `./videos/${npc}_new/${current}_new.mp4`
  video.autoplay = true;
  
  let captions = document.createElement('track');
  captions.default = true;
  captions.src = `./captions/${npc}/${current}.vtt`;
  captions.srclang = 'en';
  captions.kind = 'captions';

  video.append(captions);
  videoContainer.append(video);

  let captionsSpan = Object.assign(document.createElement("div"), {className: "typed-out"});
  videoContainer.append(captionsSpan);
}

function showCaptions() {
  var video = document.querySelector('#videoContainer video');
  var span1 = document.querySelector('#videoContainer > div');
  span1.innerHTML = '';
  if (!video.textTracks) return;
  var track = video.textTracks[0];
  track.mode = 'hidden';
  var idx = 0;

  track.oncuechange = function(e) {
    var cue = this.activeCues[0];
    if (cue) {
      if (idx >= 0) {
        span1.classList.remove('on');
        span1.innerHTML = '';
        span1.appendChild(cue.getCueAsHTML());
        span1.classList.add('on');
      }
      idx = ++idx % 2;
    }
  }
}

// function generateSymbol(desc) {
//   let symbols = {'forevermore': 'square', 'all_pasts': 
//   'square', 'eventually': 'diamond', 'some_past': 'diamond', 'tomorrow': 'triangle', 'yesterday': 'triangle'}

//   var ns = 'http://www.w3.org/2000/svg';
//   let svg = document.createElementNS(ns, 'svg');
//   let use = document.createElementNS(ns, 'use');
//   use.setAttributeNS(null, 'href', `img/icons.svg#${symbols[desc]}`);
//   use.setAttribute('class',desc);
//   svg.appendChild(use);
//   return svg;
// }

// function makeProblemBlock(phrase) {
//   let block = Object.assign(document.createElement('div'),{'className': 'drag', 'id': 1 });
//   document.getElementById('walkway').appendChild(block);
//   phrase.forEach(desc => {
// 		block.appendChild(generateSymbol(desc));
// 	})
// }