function typeWriter(options= {i:0,txt:"no text provided",speed: 50,resolve,reject}) {
  
    if (options.i < txt.length) {
      document.getElementById("dialog").innerHTML += options.txt.charAt(i);
      options.i++;
      setTimeout(()=>typeWriter(options.i,options.txt,options.speed), options.speed);
    } else {

    }
  }

function dialogEngine(npc) {
    let dialogTree = dialogs[npc];
    let next = 0;
    
    while(next !== "end") {
        // let myPromise= new Promise((reolve,reject)=>
        // typeWriter(dialogTree[next]["text"])
        console.log(dialogTree[next]["text"]);
        next = dialogTree[next]["next"];
    }

}