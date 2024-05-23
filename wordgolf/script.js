$(function () {
    new WordGolf()
 });
class WordGolf{
constructor(startLevel=0){
 this.alphabet=  ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
 this.currentLevel=startLevel
 this.getWords()
  

 
}
 async getWords() {
     let response = await fetch("dictionary.json");
     this.words = await response.json();
     response = await fetch("levels.json");
     this.levels = await response.json();
     this.init()
     
    
 }
  init() {
     this.levels[this.currentLevel]["to"].split("").forEach(element => {

         let lettersLeft = this.alphabet.filter((letter) => letter != element.toUpperCase())
         console.log(lettersLeft)
         let allOptions = [element.toUpperCase(), ...lettersLeft].map((el) => $("<option/>", { html: el }))
         console.log(allOptions)
         let sel = $("<select/>")
         $("#picker").append(sel)

     });
     document.querySelector("#title").innerHTML =  this.levels[this.currentLevel]["title"]
     this.populate(this.levels[this.currentLevel]["to"])
     $('select').on("change", (selectObject) => {
         document.querySelector("#message").innerHTML=""
         let accum = ""
         let newWord = $('select').each((i, obj) => accum += $(obj).val())
         console.log(accum)
         if (Object.keys(this.words).includes(accum.toLowerCase())) {
             document.querySelector("#history").innerHTML += `<span>${accum} </span><br>${this.words[accum.toLowerCase()]}<br/>`
             $("#right").append(accum)
         } else {
         
             let lastWord = $("#history span").toArray().reverse()[0]?.innerHTML || this.levels[this.currentLevel]["to"]

             document.querySelector("#message").innerHTML = `<span class='myred'>${accum} is not a word in the dictionary </span><br/>`
             setTimeout(() => this.populate(lastWord), 1000)

         }


         
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

}