$(function () {
    new WordGolf();
});


let globalwords;

class WordGolf {
    constructor(startLevel = 0) {
        this.alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
        this.currentLevel = startLevel
        this.getWords()
        this.totalScore = 0;
        this.callbacks = {
            "Play Again": () => {
                this.currentLevel = 0;
                this.init();
            },
            "Try Level Again": () => {
                this.init();
            },
            "Go To Next Level": () => {
                this.currentLevel += 1;
                this.init();
            }
        }
    }
    async getWords() {
        let response = await fetch("dictionary.json");
        this.words = await response.json();
        globalwords = this.words;


        // console.log(findWordLadder("wheat", "bread", this.words))
        response = await fetch("levels.json");
        this.levels = await response.json();
        this.init()
    }

    getQueryParam(param, defaultValue) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.has(param) ? urlParams.get(param) : defaultValue;
    }

    updateQueryParam(param, value) {
        const url = new URL(window.location);
        const searchParams = new URLSearchParams(url.search);
        searchParams.set(param, value);
        url.search = searchParams.toString();
        history.pushState({}, '', url); // Update the URL in the address bar
    }

    init() {
        let startWord = this.getQueryParam('from', null);  // Default to 1 if not found
        let endWord = this.getQueryParam('to', null);  // Default to 0 if not found
        let level = this.getQueryParam('sentence', null);  // Default to 'Normal'
        let score = 0;
        document.querySelector("#dialog")?.remove();

        console.log({startWord, endWord, level});

        if (!startWord && !endWord && !level) {
            document.getElementsByClassName("levels")[0].classList.remove('hidden');  // Show the div
            this.showAvailableLevels();  // Show available levels if parameters are missing
        } else {
            document.getElementsByClassName("levels")[0].classList.add('hidden');  // Hide the div
        }
        

        // shows available levels

        // if(document.querySelector('.levels').children.length === 1) {
        //     this.showAvailableLevels();
        // }
        console.log("current level: ", this.currentLevel);
        // Current level score
        this.curLevelScore = 0;
       
        let par = this.levels[this.currentLevel]["par"]+1;
        
        document.querySelectorAll("#history,#message,#correct,#picker").forEach(item => item.innerHTML = "");
        document.querySelector("#player-score").innerHTML = "Attempts: 0";
        document.querySelector("#par").innerHTML = `Par: ${par}`
        
        // this.makeModal({ div: ["Congrats!", `You completed this level in ${this.curLevelScore} attempts.`], button: ["Play Again", "g"] })

        let characters = this.levels[this.currentLevel]["from"].split("")
        characters.forEach(element => {
            // Figures out what letters are left to guess?
            let lettersLeft = this.alphabet.filter((letter) => letter != element.toUpperCase())
            // console.log(lettersLeft)
            let allOptions = [element.toUpperCase(), ...lettersLeft].map((el) => $("<option />", { html: el }))
            // console.log(allOptions)
            let sel = $("<select/>")
            sel.css({"width": `${100/characters.length}%`})
            // sel.css({"margin": `0 ${25/characters.length}% 0 ${25/characters.length}%`})
            $("#picker").append(sel)

        });
        document.querySelector("#title").innerHTML = this.levels[this.currentLevel]["title"]
        let startingWord = this.levels[this.currentLevel]["from"];
        this.populate(startingWord);
        this.makeSpan(startingWord);
        // document.querySelector("#history").innerHTML += `<span class="hover">${startingWord.toUpperCase()}</span><br/>`
        this.createDefinitionCard(startingWord.toUpperCase(), this.words[startingWord.toLowerCase()]);
        $("select").on("change", (selectObject) => {
            this.curLevelScore++;
            console.log("here in select");
            document.querySelector("#message").innerHTML = ""
            let accum = ""

            // Combines the selected letters into a word 
            let newWord = $("select").each((i, obj) => accum += $(obj).val())
            console.log(accum);
            // console.log(accum);

            if (Object.keys(this.words).includes(accum.toLowerCase())) {
                // Check for win
                if (accum.toLowerCase() === this.levels[this.currentLevel]["to"]) {
                    console.log("win")
                    this.win(par);
                } else {
                    this.animateAnswer("animateRight");
                    let definit = this.words[accum.toLowerCase()];
                    this.makeSpan(accum);
                   //document.querySelector("#history").innerHTML += `<span class= "hover">${accum}</span></br>`
                    this.createDefinitionCard(accum, definit);
                }
            } else {
                const spanElements = document.querySelectorAll('.hover');
                const last = spanElements[spanElements.length-1];
                const divs = last.querySelectorAll('div');
                const textContent = Array.from(divs).map(div => div.textContent).join('');
                // let lastWord = $("#history span").toArray().reverse()[0]?.innerHTML || this.levels[this.currentLevel]["from"]
                let lastWord = textContent || this.levels[this.currentLevel]["from"]
                console.log(lastWord);
                document.querySelector("#message").innerHTML = `<br><span class="myred">${accum} is not a word in the dictionary </span><br/>`
                
                /* Shows the input is wrong */ 
                this.animateAnswer("animateWrong")
                setTimeout(() => this.populate(lastWord), 1000)

            }

            document.querySelector("#player-score").innerHTML = `Attempts: ${this.curLevelScore}`

        })
        resizeWindow();
        $("body").fadeIn(500);
    }

    animateAnswer(animation) {
        /* Shows the input is wrong */ 
        document.querySelectorAll("select").forEach((select) => {
            select.classList.add(animation);
            select.addEventListener("animationend", (event) => {
                select.classList.remove(animation);
            });
        })
        document.querySelector("#picker").classList.add(animation);
        document.querySelector("#picker").addEventListener("animationend", (event) => {
            document.querySelector("#picker").classList.remove(animation);
        });
    }

    populate(word) {
        let selections = $("select")
        let letters = word.split("").forEach((element, i) => {
            let lettersLeft = this.alphabet.filter((letter) => letter != element.toUpperCase())
            let allOptions = [element.toUpperCase(), ...lettersLeft].map((el) => $("<option/>", { html: el }))
            $($("select")[i]).empty().append(allOptions)
        })
    }
    makeModal(properties) {
        document.querySelector("#dialog")?.remove();
        let dialog = Object.assign(document.createElement("dialog"), { "id": "dialog" })
        Object.keys(properties).forEach((prop) => {
            properties[prop].forEach((line) => {
                let current = Object.assign(document.createElement(prop), { "innerHTML": line })
                current.addEventListener("click", (e) => { this.listen(e) })
                dialog.appendChild(current)

            })
        })

        document.querySelector("#screen").append(dialog);
        dialog.show();
    }
    listen(e) {
        let callback = this.callbacks[e.currentTarget.innerHTML] || function () { };
        console.log(callback)
        callback();

    }
    win(par) {
        if(this.currentLevel === this.levels.length-1) {
            this.makeModal({ div: ["Congrats!", `You completed this level in ${this.curLevelScore} attempts.`], button: ["Play Again", "g"] })
        } else if(this.curLevelScore > par) {
            this.makeModal({ div: [`You did not complete this level under par: ${par} attempts.`], button: ["Try Level Again"] })
        } else {
            this.makeModal({ div: ["Congrats!", `You completed this level in ${this.curLevelScore} attempts.`], button: ["Try Level Again", "Go To Next Level"] })
        }
    }

    createDefinitionCard(accum, definit) {
        let def = Object.assign(document.createElement("div"), {"id": accum, "className": "definition", "innerHTML": `${accum} <hr/> ${definit}`});
        
        document.querySelector(".menu").appendChild(def);
        // def.style.visibility = "hidden";
        $(".definition").hide();
        $(".levels").show();
        // requestAnimationFrame(()=>$(".definition").hide());
        let lastLetter = "";
        let events = {"mouseenter": "fadeIn", "mouseleave": "fadeOut"}
        $(".hover").on(Object.keys(events).join(" "), function (e) {
            // if(lastLetter)
            //     return false
            // // lastLetter = 
            console.log(e.target, e.currentTarget);
            // if(!e.currentTarget.class)
            //     return;

            let word = e.currentTarget.id.split('_')[1].toUpperCase();
            console.log(word);


            // let visibilityStatus = {"mouseover": "show", "mouseout":"hide"};
            // // // let { left , top } = e.currentTarget.getBoundingClientRect();

            // // let selectedWord = e.currentTarget.innerText;
            // // let definitionCard ="#"+ e.target.id;
            // // // console.log(e.target);
            // // // console.log(e.currentTarget);

            // // console.log([visibilityStatus[e.type]])
            // // // console.log(selectedWord);
            // // // $(definitionCard).css({"left":left - (1.1 * $(`#${selectedWord}`).width()) , top});
            $(`#${word}`)[events[e.type]](250);
        })
    }

    showAvailableLevels() {
        this.levels.map((level, index) => {
            let l = Object.assign(document.createElement('button'), {"textContent": level.title}) 
            l.addEventListener("click", (e) => {
                console.log(index);
                this.currentLevel = index;
                this.init();
                
            })
            document.querySelector('.levels').append(l);
        })
    }

    makeSpan(word) {
        let span = Object.assign(document.createElement("div"), {"className": "hover", "id": `hover_${word}`});
        document.querySelector("#history").appendChild(span);
        word.split("").forEach(letter => {
            let l = Object.assign(document.createElement("div"), {"className": "card", "textContent": letter.toUpperCase()})
            l.style.width = `${100/word.length}%`;
            span.appendChild(l);
        })
    }


}