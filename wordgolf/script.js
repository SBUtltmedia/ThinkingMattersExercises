$(function () {
    new WordGolf()
});
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
        response = await fetch("levels.json");
        this.levels = await response.json();
        // console.log(this.levels.length)
        this.init()


    }
    init() {
        document.querySelector("#dialog")?.remove();
        console.log("current level: ", this.currentLevel);
        // Current level score
        this.curLevelScore = 0;
        console.log(document.querySelectorAll("#history,#message,#correct,#picker"));
        document.querySelectorAll("#history,#message,#correct,#picker").forEach(item => item.innerHTML = "");
        document.querySelector("#player-score").innerHTML = "Attempts: 0";
        document.querySelector("#par").innerHTML = `Par: ${this.levels[this.currentLevel]["par"]}`

        this.levels[this.currentLevel]["from"].split("").forEach(element => {

            // Figures out what letters are left to guess?
            let lettersLeft = this.alphabet.filter((letter) => letter != element.toUpperCase())
            // console.log(lettersLeft)
            let allOptions = [element.toUpperCase(), ...lettersLeft].map((el) => $("<option />", { html: el }))
            // console.log(allOptions)
            let sel = $("<select/>")
            $("#picker").append(sel)

        });
        document.querySelector("#title").innerHTML = this.levels[this.currentLevel]["title"]
        let startingWord = this.levels[this.currentLevel]["from"];
        this.populate(startingWord)
        document.querySelector("#history").innerHTML += `<span class="hover">${startingWord.toUpperCase()}</span><br/>`
        this.createDefinitionCard(startingWord.toUpperCase(), this.words[startingWord.toLowerCase()]);
        $("select").on("change", (selectObject) => {
            this.curLevelScore++;
            console.log("here in select");
            document.querySelector("#message").innerHTML = ""
            let accum = ""

            // Combines the selected letters into a word 
            let newWord = $("select").each((i, obj) => accum += $(obj).val())
            // console.log(accum);

            if (Object.keys(this.words).includes(accum.toLowerCase())) {
                // Check for win
                if (accum.toLowerCase() === this.levels[this.currentLevel]["to"]) {
                    console.log("win")
                    this.win();
                } else {
                    let definit = this.words[accum.toLowerCase()];
                    document.querySelector("#history").innerHTML += `<span class= "hover">${accum}</span></br>`
                    this.createDefinitionCard(accum, definit);
                }
                    // $(".hover").on("mouseout", (e) => {
                //     let selectedWord = e.currentTarget.innerText;
                //     document.querySelector("#"+ selectedWord).style.visibility = "hidden";
                // })
                // let def = Object.assign(document.createElement("div"), {"id": accum, "className": "definition", "textContent": definit});
                // document.querySelector("#history").appendChild(def);
                // document.querySelector("#message").innerHTML = `<br><span>${definit}</span><br/>`
                // (accum == this.curr)


            } else {

                let lastWord = $("#history span").toArray().reverse()[0]?.innerHTML || this.levels[this.currentLevel]["from"]
                document.querySelector("#message").innerHTML = `<br><span class="myred">${accum} is not a word in the dictionary </span><br/>`
                setTimeout(() => this.populate(lastWord), 1000)

            }

            document.querySelector("#player-score").innerHTML = `Attempts: ${this.curLevelScore}`

        })
        resizeWindow();
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

        document.querySelector(".screen").append(dialog);
        dialog.show();
    }
    listen(e) {
        let callback = this.callbacks[e.currentTarget.innerHTML] || function () { };
        console.log(callback)
        callback();

    }
    win() {
        if(this.currentLevel === this.levels.length-1) {
            this.makeModal({ div: ["Congrats!", `You completed this level in ${this.curLevelScore} attempts.`], button: ["Play Again", "g"] })
        } else if(this.curLevelScore > this.levels[this.currentLevel]["par"]) {
            this.makeModal({ div: [`You did not complete this level under par: ${this.levels[this.currentLevel]["par"]} attempts.`], button: ["Try Level Again"] })
        } else {
            this.makeModal({ div: ["Congrats!", `You completed this level in ${this.curLevelScore} attempts.`], button: ["Try Level Again", "Go To Next Level"] })
        }
    }

    createDefinitionCard(accum, definit) {
        console.log("def card")
        let def = Object.assign(document.createElement("div"), {"id": accum, "className": "definition", "textContent": definit});
        document.querySelector("#history").appendChild(def);
        def.style.visibility = "hidden";

        $(".hover").on("mouseover mouseout", function (e) {
            let visibilityStatus = {"mouseover": "visible", "mouseout":"hidden"};
            let { right , top } = e.target.getBoundingClientRect();
            console.log({ right, top });
            let selectedWord = e.currentTarget.innerText;

            let definitionCard = document.querySelector("#"+ selectedWord);
            // console.log(selectedWord);
            $(definitionCard).css({"left": right, top});
            definitionCard.style.visibility = visibilityStatus[e.type];
        })
    }


}