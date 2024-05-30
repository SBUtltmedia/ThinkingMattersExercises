$(function () {
    new WordGolf()
 });
class WordGolf{
    constructor(startLevel=0){
    this.alphabet=  ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    this.currentLevel=startLevel
    this.getWords()
    this.totalScore = 0;
    

    
    }
    async getWords() {
        let response = await fetch("dictionary.json");
        this.words = await response.json();
        response = await fetch("levels.json");
        this.levels = await response.json();
        console.log(this.levels.length)
        this.init()
        
        
    }
    init() {
        console.log('current level: ', this.currentLevel);
        console.log(this.levels.length);
        // Current level score
        let curLevelScore = 0;

        document.querySelector('#par').innerHTML = `Par: ${this.levels[this.currentLevel]["par"]}`

        this.levels[this.currentLevel]["from"].split("").forEach(element => {
            
            // Figures out what letters are left to guess?
            let lettersLeft = this.alphabet.filter((letter) => letter != element.toUpperCase())
            console.log(lettersLeft)
            let allOptions = [element.toUpperCase(), ...lettersLeft].map((el) => $("<option/>", { html: el }))
            console.log(allOptions)
            let sel = $("<select/>")
            $("#picker").append(sel)

        });
        document.querySelector("#title").innerHTML =  this.levels[this.currentLevel]["title"]
        this.populate(this.levels[this.currentLevel]["from"])
        document.querySelector("#history").innerHTML += `<span>${this.levels[this.currentLevel]["from"].toUpperCase()} </span><br/>`
        $('select').on("change", (selectObject) => {
            document.querySelector("#message").innerHTML=""
            let accum = ""

            // Combines the selected letters into a word 
            let newWord = $('select').each((i, obj) => accum += $(obj).val())
            console.log(accum);
            console.log(this.levels[this.currentLevel]['to'])
            if (Object.keys(this.words).includes(accum.toLowerCase())) {
                // Check for win
                if(accum.toLowerCase() === this.levels[this.currentLevel]["to"]) {
                    console.log('win')
                    this.win();
                }
                let definit = this.words[accum.toLowerCase()];
                document.querySelector("#history").innerHTML += `<span>${accum} </span><br/>`
                document.querySelector("#message").innerHTML = `<br><span>${definit}</span><br/>`
                // (accum == this.curr)


            } else {
            
                let lastWord = $("#history span").toArray().reverse()[0]?.innerHTML || this.levels[this.currentLevel]["from"]
                document.querySelector("#message").innerHTML = `<br><span class='myred'>${accum} is not a word in the dictionary </span><br/>`
                setTimeout(() => this.populate(lastWord), 1000)

            }

            curLevelScore++;
            document.querySelector("#player-score").innerHTML = `Your Score: ${curLevelScore}`
            
        })

    }
    populate(word) {
        let selections = $('select')
        let letters = word.split("").forEach((element, i) => {
            let lettersLeft = this.alphabet.filter((letter) => letter != element.toUpperCase())
            let allOptions = [element.toUpperCase(), ...lettersLeft].map((el) => $("<option/>", { html: el }))
            $($('select')[i]).empty().append(allOptions)
        })
    }

    win() {
        const dialog = document.querySelector("dialog");
        const nextButton = document.querySelector("button");

        dialog.showModal();

        this

        // "Close" button closes the dialog
        nextButton.addEventListener("click", () => {
            dialog.close();
            this.goToNextLevel();
        });
    }

    goToNextLevel() {
        
        document.querySelector("#history").innerHTML = "";
        document.querySelector("#message").innerHTML= "";
        document.querySelector('#correct').innerHTML = "";
        document.querySelector('#picker').innerHTML = "";
        
        this.currentLevel += 1;
        if(this.currentLevel > this.levels.length) {
            console.log('level:', this.currentLevel);
            this.currentLevel = 0;

        }

        this.init();
    }
}