const urlParams = new URLSearchParams(window.location.search);

let numberOfRooms=Math.min(urlParams.get('numberOfRooms') || 2,5);
let numberOfIceCreams=2**numberOfRooms
let yayAudio, successAudio;
let userSelectedFlavor = null;

// Iterate through all parameters
for (const [key, value] of urlParams.entries()) {
  console.log(key, value);
}

// Store values globally so other scripts can access them
window.gameConfig = {
    numberOfRooms: numberOfRooms,
    numberOfIceCreams: numberOfIceCreams
};

// Wait for the page to fully load then initialize the game and also adjust the window sizes.
addEventListener("DOMContentLoaded", () => {
    init(numberOfRooms);
    resizeWindow();
    selectRandomFlavor(numberOfIceCreams);
});


// Create the layout with flavors and checkboxes for each room
function init(numberOfRooms){

    let allFlavors = [
        ["Almond", "#D2B48C"], // Light Brown
        ["Bastani Sonnati (Persian)", "#FFD700"], // Yellow
        ["Butter Pecan", "#FFF5E1"], // Cream
        ["Cayenne Chocolate", "#5C4033"], // Dark Brown
        ["Chocolate Chip Cookie Dough", "#EED9C4"], // Beige
        ["Coconut Almond Chip", "#FFFFFF"], // White
        ["Dulce de Leche", "#C19A6B"], // Caramel
        ["English Toffee", "#8B4513"], // Brown
        ["Goat Cheese Beet Swirl", "#FFFFFF"], // White
        ["Green Tea Ice Cream", "#98FB98"], // Light Green
        ["Honey Avocado", "#FFC30B"], // Dark Yellow
        ["Honeyjack and Coke", "#654321"], // Dark Brown
        ["Huckleberry", "#800080"], // Purple
        ["Jalapeño", "#008000"], // Green
        ["Lavender Honey", "#D8BFD8"], // Light Purple
        ["Les Bourgeois and Ghirardelli", "#4B382A"], // Dark Brown
        ["Madagascar Vanilla", "#FAEBD7"], // Pale Yellow
        ["Mango", "#FFA500"], // Orange
        ["Mint Chocolate Chip", "#98FB98"], // Light Green
        ["Moose Tracks", "#EED9C4"], // Beige
        ["Passion Fruit", "#FF7518"], // Orange
        ["Pistachio", "#A7C796"], // Pale Green
        ["Peanut Butter", "#D2B48C"], // Light Brown
        ["Pralines and Cream", "#FFF5E1"], // Cream
        ["Red Velvet", "#C71585"], // Red
        ["Rum Raisin", "#FFF5E1"], // Cream
        ["Spumoni", "#008000"], // Green
        ["Strawberry", "#FFC0CB"], // Pink
        ["Sweet Potato Maple Walnut", "#D2691E"], // Orange
        ["Ube (Philippines, Purple Yam)", "#6A0DAD"], // Dark Purple
        ["Vietnamese Coffee", "#D2B48C"] // Light Brown
    ];    
    let flavorContainer =  Object.assign(document.createElement("div"), {
        id: "flavorContainer"
    });

    let roomContainer = document.getElementById("gameRoom")

    // Create header row
    let headerContainer = Object.assign(document.createElement("div"), {
        id: "headerContainer",
        className: "headerClass",
    });

    let contentOfTheHeader = Object.assign(document.createElement("div"), {
        innerHTML: "<h2>FLAVORS</h2>",
        className: "roomHeaderClass",
    });

    headerContainer.appendChild(contentOfTheHeader);

    for(let i = 0 ; i < numberOfRooms ; i++){
        let roomHeaderDiv = Object.assign(document.createElement("div"),{
            innerHTML : `<h2>ROOM ${i+1}</h2>`,
            className:"roomHeaderClass"
        })
        headerContainer.appendChild(roomHeaderDiv)
    }

    let yesOrNoContainer =  Object.assign(document.createElement("div"), {
        id: "yesOrNoContainer",
        className: "yes-or-no-container"
    });
    
    let kingChoiceText = Object.assign(document.createElement("div"), {
        innerHTML: "Room Contains King Choice?",
        className: "king-choice-text",
        style: `display: grid; grid-template-columns: repeat(${numberOfRooms+1}, 1fr)`,

    });


    roomContainer.appendChild(headerContainer)
    roomContainer.appendChild(flavorContainer)
    roomContainer.appendChild(yesOrNoContainer)
    yesOrNoContainer.appendChild(kingChoiceText);



    let currentFlavors = allFlavors.sort(() => Math.random() - 0.5).slice(0, numberOfIceCreams); 
 
    currentFlavors.forEach((flavor,id) => {
        let flavorDiv=Object.assign(document.createElement("div"),{
            innerHTML:flavor[0],
            id: `flavor_row_${id}`,
            className:"flavorClass",
            style: `display: grid; grid-template-columns: repeat(${numberOfRooms+1}, 1fr)`,
    })
    flavorDiv.style.cursor = "pointer";    
    flavorContainer.append(flavorDiv)
    
    flavorDiv.addEventListener("click", () => handleFlavorClick(flavorDiv, flavor));

    for (let i = 0; i < numberOfRooms; i++) {
        let roomId = `room_${i}`
        let roomDiv = document.getElementById(`${roomId}`);
        let checkboxWrapper = Object.assign(document.createElement("div"), {
            id: `checkbox_wrapper_room_${i}_checkbox_row_${id}`,
            className: "checkbox-wrapper"
        });

        let checkboxId = `room_${i}_checkbox_row_${id}`
        let coneId = `${checkboxId}_cone`

        let checkbox = Object.assign(document.createElement("input"), {
            type: "checkbox",
            id: checkboxId
        });


        let svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgElement.setAttribute("viewBox", "0 0 208 334");
        svgElement.style.width = "6rem";
        svgElement.classList.add("ghosted");

        checkboxWrapper.addEventListener("click",(e)=>{

            // console.log(e.currentTarget)
            let checkbox = document.getElementById(e.currentTarget.id.split("checkbox_wrapper_")[1])
            // console.log(checkbox.checked)
            checkbox.checked = !checkbox.checked;
            let cone = document.getElementById(coneId)
            cone.classList.toggle("ghosted");

            let selectedFlavor = String(flavor).split(",")[0].trim();
            // console.log("selectedflavour ", selectedFlavor)
            let flavorEntry = allFlavors.find(entry => entry[0] === selectedFlavor);
            console.log(flavorEntry, "EUREKA");
            // let coneColor = flavorEntry[1];
            // console.log(flavorEntry[1], "conecolour")
            let coneColor = flavorEntry ? flavorEntry[1] : "#FFC0CB";
            useElement.setAttribute("style", `--color_fill: ${coneColor};`);

        })
        
        let useElement = Object.assign(document.createElementNS("http://www.w3.org/2000/svg", "use"), {
            setAttribute: function(name, value) { this.setAttributeNS(null, name, value); }
        });

        
        // Setting attributes
        useElement.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "icecream.svg#cone");
        svgElement.setAttribute("id", coneId);
        // useElement.setAttribute("style","--color_fill: purple;")
        // Appending <use> to <svg>
        svgElement.appendChild(useElement);
        
        checkboxWrapper.appendChild(checkbox);
        checkboxWrapper.appendChild(svgElement);
        flavorDiv.appendChild(checkboxWrapper);

    }
});

    let submitButtonContainer = Object.assign(document.createElement("div"),
    {className: "submit-container",
        style: `display: grid; grid-template-columns:1fr ${numberOfRooms}fr`
    })

    let spacer = Object.assign(document.createElement("div"),
    {className: "fClass"})

    let centeredButton = Object.assign(document.createElement("div"),
    {className: "center"})

    let submitButton = Object.assign(document.createElement("div"),
    {innerHTML: "Submit",
    id: "submit-btn"})

    submitButton.onclick = () => handleSubmit(numberOfIceCreams);
    submitButtonContainer.appendChild(spacer);
    centeredButton.appendChild(submitButton);
    submitButtonContainer.appendChild(centeredButton);
    roomContainer.appendChild(submitButtonContainer);
}


// Handle flavor clicks
function handleFlavorClick(flavorDiv, flavor) {
    document.querySelectorAll(".flavorClass").forEach(div => {
        div.style.backgroundColor = "";
        div.style.color = "";
    });

    // save the user's selected flavor
    userSelectedFlavor = flavor;
    console.log("Selected flavor:", userSelectedFlavor);
}



function isCorrectRoomConfig(roomsInfo){
    // let numberOfRooms=roomsInfo[0].length
    // let numberOfIcecreams=2**numberOfRooms
    // let iceCreamSet=new set
    return roomsInfo.length!=Array.from(new Set(roomsInfo)).length
}


// Play audio depending on the scenario 
function playAudio(param) {
    let audio;
    switch (param) {
        case "success":
            audio = new Audio('audio/success.mp3');
            break;
        case "yay":
            audio = new Audio('audio/yay.mp3');
            break;
        case "error":
            audio = new Audio('audio/error.mp3');
            audio.currentTime = 0.41;
            break;
        default:
    }
    audio.play();
    return audio;
}


// Toast to raise if the answer submitted by the user is incorrect
function displayToast(messageText, isFailure) {
    playAudio("error");

    Toastify({
        text: messageText,
        duration: 3000,
        gravity: "top",
        position: "right",
        stopOnFocus: false,
        style: {
            background: isFailure ? "crimson" : "green",
            color: "white",
            fontWeight: "bold",
            borderRadius: "5px",
            padding: "15px 25px",
            lineHeight: "1.5",
            margin: "10px",
            maxWidth: "300px",
            wordWrap: "break-word",
            fontFamily: '"Special Elite", system-ui',
            opacity: "0.8"
        }
    }).showToast();
}



// Method to allow the user to click the king's flavor in the end
function clickFLavorEnd() {
    let flavorElements = document.querySelectorAll(".flavorClass");
    flavorElements.forEach((flavorElement) => {
        flavorElement.addEventListener("click", handleFlavor);
    });
}

// Logic to verify user's flavor selection
function handleFlavor(event) {
    userSelectedFlavor = event.target.textContent.trim();
    console.log("User selected flavor:", userSelectedFlavor);

    // Check if the selected flavor matches the backend-selected flavor, if yes then success and yay
    if (userSelectedFlavor === backendSelectedFlavor) {
        successAudio = playAudio("success");
        yayAudio = playAudio("yay");
        displayMessage("Good Job!", true);
        createPopper();

        // lets also disable further clicks
        disableFlavorClick();
    } else {
        displayToast("Wrong flavor! Try again.", true);
        // reset our button for user to click something else
        userSelectedFlavor = null; 
    }
}

// Method to disable all flavor clicks
function disableFlavorClick() {
    let flavorElements = document.querySelectorAll(".flavorClass");
    flavorElements.forEach((flavorElement) => {
        flavorElement.removeEventListener("click", handleFlavor);
    });
}


// Simply display Yes/No for the backend selected flavor
function displayYesOrNoForSelectedFlavor(numberOfIceCreams, yesOrNoContainer) {
    displayToast("Click your flavor of ice cream.", false);

    // Clear previous Yes/No rows but keep the header
    yesOrNoContainer.querySelectorAll('.yes-or-no-row:not(.header)').forEach(row => row.remove());

    for (let i = 0; i < numberOfIceCreams; i++) {
        let flavorDiv = document.getElementById(`flavor_row_${i}`);
        if (!flavorDiv) continue;

        let flavorName = flavorDiv.textContent.trim();

        // Just only process the backend selected flavor
        if (flavorName === backendSelectedFlavor) {
            let rowDiv = document.createElement("div");
            rowDiv.className = "yes-or-no-row";
            rowDiv.style.display = `grid`;
            rowDiv.style.gridTemplateColumns = `repeat(${numberOfRooms + 1}, 1fr)`;

            // Add the constant text
            let headerCell = document.createElement("div");
            headerCell.className = "yes-or-no-cell";
            headerCell.innerText = "Room Contains King Choice?";
            rowDiv.appendChild(headerCell);

            for (let j = 0; j < numberOfRooms; j++) {
                let checkbox = document.getElementById(`room_${j}_checkbox_row_${i}`);
                let cellDiv = document.createElement("div");
                cellDiv.className = "yes-or-no-cell";

                let value = checkbox.checked ? "Yes" : "No";
                cellDiv.innerText = value;
                rowDiv.appendChild(cellDiv);
            }

            yesOrNoContainer.appendChild(rowDiv);
            break;
        }
    }
}



// Collect and check the checkboxes selected by the user
function handleSubmit(numberOfIceCreams) {

    // Reset the highlight class before creating the binary string
    var elements = document.getElementsByClassName('highlight');
    while (elements.length > 0) {
        elements[0].classList.remove("highlight");
    }

    let arr = [];
    let yesOrNoContainer = document.getElementById("yesOrNoContainer");
    yesOrNoContainer.innerHTML = "";

    // Go through each flavor and create a binary string of checked rooms
    for (let i = 0; i < numberOfIceCreams; i++) {
        let roomConfig = "";
        for (let j = 0; j < numberOfRooms; j++) {
            let checkbox = document.getElementById(`room_${j}_checkbox_row_${i}`);
            roomConfig += checkbox.checked ? "1" : "0";
        }

        arr.push(roomConfig);

    // Check the duplicate values for each row in real time
        let dupIndex = findDupRows(arr, roomConfig);
        if (dupIndex !== -1 && dupIndex !== i) {
            displayToast("Wrong choices, revise binary tree concepts and take one more chance!!",true);

            let dupRow = document.querySelectorAll(`[id*="row_${dupIndex}"]`);
            for (const row of Array.from(dupRow)) {
                row.classList.add("highlight");
            }
            return;
        }
    }

    validateCombination(arr, numberOfRooms)

    clickFLavorEnd();
}



function findDupRows(arr, currRow){
    for (let i=0;i<arr.length-1;i++) {
        if (arr[i]===currRow) {
            return i;
        }
    }
    return -1;
}


// Show a popup message if the selection is right
function displayMessage(messageText, isSuccess) {
    let modalOverlay = document.createElement("div");
    modalOverlay.setAttribute("id", "message-modal-overlay");

    let modalContent = document.createElement("div");
    modalContent.className = "modal-content modal-success"; 

    let message = document.createElement("p");
    message.innerText = messageText;
    modalContent.appendChild(message);

    let okButton = document.createElement("button");
    okButton.innerText = "OK";
    okButton.onclick = () => {
        document.body.removeChild(modalOverlay);
        if (yayAudio) yayAudio.pause();
        if (successAudio) successAudio.pause();
    };

    modalContent.appendChild(okButton);
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
}


//  Party popup on successfully solving the game
function createPopper(){
    confetti({
      particleCount: 1000,
      spread: 100,
      origin: { x: 0, y: 0.9 },
    });
  
    confetti({
      particleCount: 1000,
      spread: 100,
      origin: { x: 1, y: 0.9 },
    });
}


// Compare the user's selection with the correct combinations
function validateCombination(userArr, numberOfRooms) {
    let correctArr = generateCorrectBinaryCombinations(numberOfRooms);

    let sortedUserArr = [...userArr].sort();
    let sortedCorrectArr = [...correctArr].sort();

    if (JSON.stringify(sortedUserArr) === JSON.stringify(sortedCorrectArr)) {
        displayYesOrNoForSelectedFlavor(numberOfIceCreams, yesOrNoContainer);
        // successAudio = playAudio("success");
        // yayAudio = playAudio("yay");
        // displayMessage("Good Job!", true);
        // createPopper();
        }else {
        // displayMessage("Wrong choices, revise binary tree concepts and take one more chance!", false);
    }
}


// Choosing King's flavor
let backendSelectedFlavor = "";

function selectRandomFlavor(numberOfIceCreams) {
    const flavorElements = Array.from(document.querySelectorAll(".flavorClass"));
    const shuffledFlavors = fYateSelect(flavorElements);
    const selectedFlavorElement = shuffledFlavors[0];

    backendSelectedFlavor = selectedFlavorElement.textContent.trim();
    console.log("Backend-selected flavor:", backendSelectedFlavor);
  }

  //fisher yate algorithm
  function fYateSelect(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        let temp = arr[j];
        arr[j] = arr[i];
        arr[i] = temp;    
    }
    return arr;
}



// Generate all possible correct binary combinations for the given number of rooms
function generateCorrectBinaryCombinations(numberOfRooms) {
    let correctArr = [];

    for (let i = 0; i < numberOfIceCreams; i++) {
        let binaryString = i.toString(2).padStart(numberOfRooms, '0');
        correctArr.push(binaryString);
    }
    return correctArr;
}


function handleClick(e){
    // console.log(e.currentTarget.id)
}