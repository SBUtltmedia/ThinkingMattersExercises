window.addEventListener("resize", resizeWindow);

const ASPECT = 16 / 9; // Define the aspect ratio


// Function to resize the window
function resizeWindow() {
    // Get window width and height
    var w = window.innerWidth; // Use plain JavaScript to get window width
    var h = window.innerHeight; // Use plain JavaScript to get window height

    var stageWidth, stageHeight, stageLeft, stageTop;
    var coverTop, coverBottom, coverLeft, coverRight;

    // Calculate stage dimensions based on aspect ratio
    if ((w / h) >= ASPECT) {
        stageHeight = h;
        stageWidth = ASPECT * h;
        stageLeft = (w - stageWidth) / 2;
        stageTop = 0;
        coverTop = 0;
        coverBottom = 0;
        coverLeft = stageLeft;
        coverRight = stageLeft;
    } else {
        stageWidth = w;
        stageHeight = (1 / ASPECT) * w;
        stageTop = (h - stageHeight) / 2;
        stageLeft = 0;
        coverTop = stageTop;
        coverBottom = stageTop;
        coverLeft = 0;
        coverRight = 0;
    }

    // Update "screen" object properties using plain JavaScript
    var screen = document.querySelector(".screen");
    if (screen) {
        screen.style.width = stageWidth + "px";
        screen.style.height = stageHeight + "px";
        screen.style.left = stageLeft + "px";
    }

    let scalingFactor = stageHeight/40;
    // if (Array.from(document.getElementById("game-title").classList))
    //     {
    //     // scalingFactor = stageHeight/(30^(numberOfRooms));
    //     scalingFactor = stageHeight / (stageWidth / 7);
    // }


    // Resize text based on stage height
    document.documentElement.style.fontSize = (scalingFactor) + "px";

    // document.querySelectorAll(".headerClass").forEach((flavorClassElement) => {
    //     flavorClassElement.style.display = 'grid';
    //     flavorClassElement.style.gridTemplateColumns = `repeat(${numberOfRooms + 1}, 1fr)`;
    // });


    // document.querySelectorAll(".border-container").forEach((borderElement) => {
    //     // borderElement.style.transform = `scale(${scalingFactor*0.08}) `;
    //     // borderElement.style.backgroundImage = "url('images/bordertile.jpg')";
    //     borderElement.style.backgroundRepeat = `repeat-${scalingFactor*0.5}`;
    //     // borderElement.style.backgroundSize = "auto 100%";
    // });
    

    // document.querySelectorAll(".yes-or-no-container").forEach((flavorClassElement) => {
    //     flavorClassElement.style.display = 'grid';
    //     flavorClassElement.style.gridTemplateColumns = `repeat(${numberOfRooms}, 3fr)`;
    // });

    // let flavorClass = document.querySelectorAll('.flavorClass');

    // flavorClass.setAttribute('style', 'display: grid; grid-template-columns: repeat(3, 1fr);')
    // console.log("here",`repeat(${numberOfRooms})`)
    // flavorClass.style.setProperty('grid-template-columns', 'repeat(`${numberOfRooms}`, 1fr)');


    // Example of updating borders (if needed)
    // var fillInAnswer = document.getElementById("fillInAnswer");
    // if (fillInAnswer) {
    //     var borderSize = stageHeight * 0.003;
    //     fillInAnswer.style.border = borderSize + "px solid white";
    // }


}
