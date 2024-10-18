let numberOfRooms=2

addEventListener("DOMContentLoaded",() => init(numberOfRooms));

function init(numberOfRooms){

let numberOfIceCreams=2**numberOfRooms

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

    for(let i = 0 ; i < numberOfRooms ; i++){
        let roomDiv = Object.assign(document.createElement("div"),{
            innerHTML : `<h2>ROOM ${i+1}</h2>`,
            id : `room_${i}`,
            className:"column"
        })
        roomContainer.append(roomDiv)
    }

    let parentContainer=document.getElementById("container")
    let gridTemplateColumns = `2fr `;
    for (let i = 0; i < numberOfRooms; i++) {
        gridTemplateColumns += `1fr `;
    }
    parentContainer.setAttribute("style",`grid-template-columns:${gridTemplateColumns.trim()}`);

    let currentFlavors = allFlavors.slice(0, numberOfIceCreams); 

    currentFlavors.forEach((flavor,id) => {
        let flavorDiv=Object.assign(document.createElement("div"),{
            innerHTML:flavor,
            id,
            className:"flavorClass"
        })
    flavorContainer.append(flavorDiv)
    flavorDiv.addEventListener('click',handleClick)

    console.log("current number of icecreams",2**numberOfRooms)

    for (let i = 0; i < numberOfRooms; i++) {
        let roomId = `room_${i}`
        console.log(roomId)
        console.log("Here",i)
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
    submitButton.onclick = handleSubmit;

    submitButtonContainer.appendChild(submitButton);
    parentContainer.appendChild(submitButtonContainer);

    // for (let i = 0; i < numberOfRooms; i++) {
    //     let roomDiv = document.getElementById(`room_${i}`);
        
    //     let dropdownContainer = Object.assign(document.createElement("div"), {
    //         className: "dropdown-container"
    //     });
    //     let dropdown = Object.assign(document.createElement("select"), {
    //         id: `room_${i}-dropdown`
    //     });

    //     let emptyOption = Object.assign(document.createElement("option"), {
    //         value: "",
    //         innerHTML: ""
    //     });
    //     let yesOption = Object.assign(document.createElement("option"), {
    //         value: "Yes",
    //         innerHTML: "Yes"
    // //     });
    //     let noOption = Object.assign(document.createElement("option"), {
    //         value: "No",
    //         innerHTML: "No"
    //     });

    //     dropdown.appendChild(emptyOption);
    //     dropdown.appendChild(yesOption);
    //     dropdown.appendChild(noOption);

    //     dropdownContainer.appendChild(dropdown);
    //     roomDiv.appendChild(dropdownContainer);
    // }

}

function isCorrectRoomConfig(roomsInfo){
    // let numberOfRooms=roomsInfo[0].length
    // let numberOfIcecreams=2**numberOfRooms
    // let iceCreamSet=new set
    return roomsInfo.length!=Array.from(new Set(roomsInfo)).length
}

function handleSubmit() {
    alert("Submit button clicked!");
}

function handleClick(e){
    console.log(e.currentTarget.id)
}