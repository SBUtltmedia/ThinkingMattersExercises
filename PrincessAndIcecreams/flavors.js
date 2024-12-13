const urlParams = new URLSearchParams(window.location.search);

let numberOfRooms=Math.min(urlParams.get('numberOfRooms') || 2,5);
let numberOfIceCreams=2**numberOfRooms
let yayAudio, successAudio;

// Iterate through all parameters
for (const [key, value] of urlParams.entries()) {
  console.log(key, value);
}

// Wait for the page to fully load then initialize the game and also adjust the window sizes.
addEventListener("DOMContentLoaded",() => {
    init(numberOfRooms);    
    resizeWindow();
});


// Create the layout with flavors and checkboxes for each room
function init(numberOfRooms){

let allFlavors=["Almond",
    "Bastani sonnati  (Persian)",
    "Butter Pecan",
    "Cayenne chocolate",
    "Chocolate chip cookie dough",
    "Coconut almond chip",
    "Dulce de leche",
    "English toffee",
    "Goat cheese beet swirl",
    "Green tea ice cream",
    "Honey avocado",
    "Honeyjack and Coke",
    "Huckleberry",
    "Jalapeño",
    "Lavender honey",
    "Les Bourgeois and Ghirardelli",
    "Madagascar vanilla",
    "Mango",
    "Mint chocolate chip",
    "Moose Tracks",
    "Passion fruit",
    "Pistachio",
    "Peanut butter",
    "Pralines and cream",
    "Red velvet",
    "Rum raisin",
    "Spumoni",
    "Strawberry",
    "Sweet potato maple walnut",
    "Ube (Philippines, purple yam)",
    "Vietnamese Coffee"]
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

    roomContainer.appendChild(headerContainer)
    roomContainer.appendChild(flavorContainer)

    let currentFlavors = allFlavors.sort(() => Math.random() - 0.5).slice(0, numberOfIceCreams); 
 
    currentFlavors.forEach((flavor,id) => {
        let flavorDiv=Object.assign(document.createElement("div"),{
            innerHTML:flavor,
            id: `flavor_row_${id}`,
            className:"flavorClass"
    })
        
    flavorContainer.append(flavorDiv)
    flavorDiv.addEventListener('click',handleClick)

    for (let i = 0; i < numberOfRooms; i++) {
        let roomId = `room_${i}`
        let roomDiv = document.getElementById(`${roomId}`);
        // let checkboxContainer = Object.assign(document.createElement("div"), {
        //     className: "checkbox-container"
        // });
        let checkboxWrapper = Object.assign(document.createElement("div"), {
            id: `checkbox_wrapper_room_${i}_checkbox_row_${id}`,
            className: "checkbox-wrapper"
        });
        let checkbox = Object.assign(document.createElement("input"), {
            type: "checkbox",
            id: `room_${i}_checkbox_row_${id}`
        });
        checkboxWrapper.appendChild(checkbox);
        // roomDiv.appendChild(checkboxWrapper);
        flavorDiv.appendChild(checkboxWrapper);

    }
});

    let submitButtonContainer = document.createElement("div");
    submitButtonContainer.className = "submit-container";

    let submitButton = document.createElement("button");
    submitButton.innerHTML = "Submit";
    submitButton.id = "submit-btn";

    // deciding mathematically how to posiiton the submit button in the middle of the rooms
    // let middleRoom = Math.ceil(numberOfRooms / 2) + 1;
    // console.log(middleRoom)
    // submitButtonContainer.style.gridColumn = numberOfRooms % 2 === 0 
    // ? `${middleRoom} / span 2` 
    // : `${middleRoom}`; 

    let totalWidth = document.getElementById("game").offsetWidth;
    let totalColumns = numberOfRooms + 1;
    let columnWidth = totalWidth / totalColumns;

    let middlePosition = (totalWidth / 2) + (columnWidth / 2);

    submitButtonContainer.style.position = "relative";
    submitButtonContainer.style.left = `${middlePosition*0.050}rem`;


    submitButton.onclick = () => handleSubmit(numberOfIceCreams);
    submitButtonContainer.appendChild(submitButton);
    roomContainer.appendChild(submitButtonContainer);
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


// Collect and check the checkboxes selected by the user
function handleSubmit(numberOfIceCreams) {

    // Reset the highlight class before creating the binary string
    var elements = document.getElementsByClassName('highlight');
    while (elements.length > 0){
    elements[0].classList.remove("highlight");}

    let arr = [];

    // Go through each flavor and create a binary string of checked rooms
    for (let i = 0; i < numberOfIceCreams; i++) {
        let roomConfig = '';
        for (let j = 0; j < numberOfRooms; j++) {
            let checkbox = document.getElementById(`room_${j}_checkbox_row_${i}`);
            roomConfig += checkbox.checked ? '1' : '0';
        }
        arr.push(roomConfig);

        // Check the duplicate values for each row in real time
        let dupIndex = findDupRows(arr, roomConfig);
        if (dupIndex !== -1 && dupIndex !== i) {
            displayToast("Wrong choices, revise binary tree concepts and take one more chance!!", true);
            let dupRow = document.querySelectorAll(`[id*="row_${dupIndex}"]`)
            for(const row of Array.from(dupRow)){
                row.classList.add("highlight")
            }
            return;
        }
    }
    validateCombination(arr, numberOfRooms);    
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
    // modalContent.classList.add(isSuccess ? "modal-success" : "modal-error");

    let message = document.createElement("p");
    message.innerText = messageText;
    modalContent.appendChild(message);

    let okButton = document.createElement("button");
    okButton.innerText = "OK";
    okButton.onclick = () => {
        document.body.removeChild(modalOverlay);
        removeConfetti();
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
        successAudio = playAudio("success");
        yayAudio = playAudio("yay");
        displayMessage("Good Job!", true);
        createPopper();
        }else {
        // displayMessage("Wrong choices, revise binary tree concepts and take one more chance!", false);
    }
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
    console.log(e.currentTarget.id)
}