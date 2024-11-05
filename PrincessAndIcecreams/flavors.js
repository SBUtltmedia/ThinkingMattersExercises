let numberOfRooms=2
let numberOfIceCreams=2**numberOfRooms

addEventListener("DOMContentLoaded",() => init(numberOfRooms));

//create the layout with flavors and checkboxes for each room
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
    let flavorContainer = document.getElementById("flavorContainer")
    let roomContainer = document.getElementById("container")

     //create a column for each room
    for(let i = 0 ; i < numberOfRooms ; i++){
        let roomDiv = Object.assign(document.createElement("div"),{
            innerHTML : `<h2>ROOM ${i+1}</h2>`,
            id : `room_${i}`,
            className:"column"
        })
        roomContainer.append(roomDiv)
    }

    //adjusting the 1 or more than 1 columns layout for each room
    let parentContainer=document.getElementById("container")
    let gridTemplateColumns = `2fr `;
    for (let i = 0; i < numberOfRooms; i++) {
        gridTemplateColumns += `1fr `;
    }
    parentContainer.setAttribute("style",`grid-template-columns:${gridTemplateColumns.trim()}`);

    //get only as many flavors as needed for the combinations on the basis of the number of rooms
    let currentFlavors = allFlavors.slice(0, numberOfIceCreams); 

    currentFlavors.forEach((flavor,id) => {
        let flavorDiv=Object.assign(document.createElement("div"),{
            innerHTML:flavor,
            id: `flavor-${id+1}`,
            className:"flavorClass"
        })
    flavorContainer.append(flavorDiv)
    flavorDiv.addEventListener('click',handleClick)

    // console.log("current number of icecreams",2**numberOfRooms)

    for (let i = 0; i < numberOfRooms; i++) {
        let roomId = `room_${i}`
        // console.log(roomId)
        // console.log("Here",i)
        let roomDiv = document.getElementById(`room_${i}`);
        let checkboxContainer = Object.assign(document.createElement("div"), {
            className: "checkbox-container"
        });
        let checkbox = Object.assign(document.createElement("input"), {
            type: "checkbox",
            id: `room_${i}-checkbox-${id}`
        });
        checkboxContainer.appendChild(checkbox);
        roomDiv.appendChild(checkboxContainer);
    }

    });

    let submitButtonContainer = document.createElement("div");
    submitButtonContainer.className = "submit-container";

    let submitButton = document.createElement("button");
    submitButton.innerHTML = "Submit";
    submitButton.id = "submit-btn";
    // submitButton.onclick = handleSubmit(numberOfIceCreams);
    submitButton.onclick = () => handleSubmit(numberOfIceCreams);

    submitButtonContainer.appendChild(submitButton);
    parentContainer.appendChild(submitButtonContainer);

}

function isCorrectRoomConfig(roomsInfo){
    // let numberOfRooms=roomsInfo[0].length
    // let numberOfIcecreams=2**numberOfRooms
    // let iceCreamSet=new set
    return roomsInfo.length!=Array.from(new Set(roomsInfo)).length
}

//collect and check the checkboxes selected by the user
function handleSubmit(numberOfIceCreams) {
    let arr = [];
    
    //go through each flavor and create a binary string of checked rooms
    for (let i = 0; i < numberOfIceCreams; i++) {
        let roomConfig = '';
        for (let j = 0; j < numberOfRooms; j++) {
            let checkbox = document.getElementById(`room_${j}-checkbox-${i}`);
            roomConfig += checkbox.checked ? '1' : '0';
        }
        arr.push(roomConfig);
    }

    validateCombination(arr, numberOfRooms);    
}

// function findDupRows(rowString){
//     for (let i = 0; i < numberOfIceCreams; i++) {
//         let currRow = ""
//         for (let j = 0; j < numberOfRooms; j++) {
//           currRow += document.getElementById(`room_${j}-checkbox-${i}`).checked?'1':'0';
//     }

//     if (currRow == rowString) {
//         return i;
//     }
//     }

//     return False

//     }

// show a popup message if the selection is wrong or right
function displayMessage(messageText, isSuccess) {
    let modalOverlay = document.createElement("div");
    modalOverlay.setAttribute("id", "message-modal-overlay");

    let modalContent = document.createElement("div");
    modalContent.className = "modal-content";
    modalContent.classList.add(isSuccess ? "modal-success" : "modal-error");

    let message = document.createElement("p");
    message.innerText = messageText;
    modalContent.appendChild(message);

    let okButton = document.createElement("button");
    okButton.innerText = "OK";
    okButton.onclick = () => {
        document.body.removeChild(modalOverlay);
    };

    modalContent.appendChild(okButton);
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
}

//compare the user's selection with the correct combinations
function validateCombination(userArr, numberOfRooms) {
    let correctArr = generateCorrectBinaryCombinations(numberOfRooms);

    let sortedUserArr = [...userArr].sort();
    // console.log(sortedUserArr);
    let sortedCorrectArr = [...correctArr].sort();
    // console.log(sortedCorrectArr);

    if (JSON.stringify(sortedUserArr) === JSON.stringify(sortedCorrectArr)) {
        displayMessage("Good job!", true);
    }else {
        displayMessage("Wrong choices, revise binary tree concepts and take one more chance!", false);
    }
}

//generate all possible correct binary combinations for the given number of rooms
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