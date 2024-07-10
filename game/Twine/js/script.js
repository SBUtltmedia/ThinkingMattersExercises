let player;
let currentMovement = null;
let currentFrame = 7;
let frameNumber = 24;
let wasd_move = 0.5
let frameWidth = 100 / (frameNumber - 1);
let frameHeight = 100 / 3;
let lastE = null;

const movePlayer = .60;

let lookup = {
    'w': { 'style': {'top': -wasd_move , 'left': 0} , 'row': 2 },
    's': { 'style': {'top': wasd_move , 'left': 0}, 'row': 3 },
    'a': { 'style': {'top': 0, 'left': -wasd_move}, 'row': 1 },
    'd': { 'style': {'top': 0 , 'left': wasd_move}, 'row': 0 }
}


let collidables;
let lastnonOverlap = {'left':"5%", 'top': "5%"};

function makeDoors(currentPassage) {
    console.log(currentPassage);
    
    const [x,y] = currentPassage.split("_").map(Number);
    console.log(x,y);

    const up = `${x}_${y + 1}`;
    const down = `${x}_${y - 1}`;
    const left = `${x - 1}_${y}`;
    const right = `${x + 1}_${y}`;

    let adjacent = { up, down, left, right};
    console.log(adjacent)

    let index = 1;

    Object.entries(adjacent).forEach(([direction, adjRoom]) => {
        if(SugarCube.Story.has(adjRoom)) {
            let door = createDoor(direction, `box${index}`);
            document.getElementById("walkway").append(door);
            console.log(door);
            collisionCallbacks[`box${index}`] = () => {
                SugarCube.Engine.play(adjRoom);
                console.log(door.style.left) 
                $('.hide').show()};
        }
        index++;
    });

    collidables = document.querySelectorAll(".collidable")
    console.log('collidables: ', collidables )
    
}

function createDoor(direction, doorID) {
    let door = Object.assign(document.createElement('div'),{"id":doorID,"className":"collidable"});
    switch(direction) {
        case 'up':
            door.style.left = '50%';
            door.style.top = '0%';
            break;
        case 'down':
            door.style.left = '50%';
            door.style.top = '95%';
            break;
        case 'left':
            door.style.left = '0%';
            door.style.top = '50%';
            break;
        case 'right':
            door.style.left = '95%';
            door.style.top = '50%';
            break;
    }
    return door;
}

// $(setTimeout(init,1000))
// $(document).on(':passagestart', (ev) => {
//     init();
//     //fade($("#passages"), 1);
// })
init();

function getAngle(x, y) {
   return Math.floor(Math.atan2(y, x) * 0.5 * Math.PI);
}

function getDirection(angle) {
    let currentDirection;
    switch (true) {
        case (angle <= 45 && angle > -45):
            //east
            currentDirection = 0;
            break;
        case (angle <= 135 && angle > 45): 
            //south
            currentDirection = 3;
            break;
        case (angle <= -135 || angle > 135):
            //west
            currentDirection = 1;
            break;
        case (angle <= -45 && angle > -135):
            //north
            currentDirection = 2;
            break;
      }
      return currentDirection;
}
function init(){
   player = document.getElementById('player');
    if(!player) {
        setTimeout(init);
        return;
    } else {
        tryResize();
    }
    player.style.left = "5%"
    player.style.top = "5%"
    SugarCube.Engine.play('0_0');

move()
function move() {
    requestAnimationFrame(() => {
        if (currentMovement) { moveChar(currentMovement) }
        else { standing() }
        move()
    }
    )
}

// collidables.forEach((el, id) => {

//     let itemLeft = Math.random() * 100;
//     let itemTop = Math.random() * 100;
//     el.style.left = `${itemLeft}%`;
//     el.style.top = `${itemTop}%`;

// })


function overlaps(a, b) {
    const rect1 = a.getBoundingClientRect();
    const rect2 = b.getBoundingClientRect();
    const isInHoriztonalBounds =
        rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x;
    const isInVerticalBounds =
        rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y;
    const isOverlapping = isInHoriztonalBounds && isInVerticalBounds;
    return isOverlapping;
}

function moveChar(moveData) {
    for(let i=0; i<collidables.length; i++) {
        if(overlaps(player, collidables[i])) {
            player['style']["left"] = lastnonOverlap["left"];
            player['style']["top"] = lastnonOverlap["top"];
            collisionCallbacks[collidables[i].id]() 
            currentMovement = null;
            return false;
            // return;
        } else {
            lastnonOverlap["left"] = player['style']["left"];
            lastnonOverlap["top"] = player['style']["top"];
        }
    }
    // collidables.forEach(
    //     (el, id) => { 
    //         if (overlaps(player, el)) { 
    //             moveData['style']["left"]=- moveData['style']["left"]
    //             moveData['style']["top"]=- moveData['style']["top"]
    //             collisionCallbacks[el.id]() 
    //             currentMovement = null;
    //         }
    //     })
        
    if(moveData["steps"] != Infinity) {
        x = frameWidth * currentFrame
        y = frameHeight * moveData['row']
        setChar(x,y)
    }
    let playerSize = {}
    playerSize["left"]  = $("#player").width() / $("#walkway").width() * 100;
    playerSize["top"]  = $("#player").height() / $("#walkway").height() * 100;
    for (i of ["left","top"]) {
        let offset = playerSize[i]
        console.log(offset);
        player.style[i]=(Math.min(100- offset, Math.max(0, (parseFloat(player.style[i])+(moveData['style'][i]))))) + '%';
        /* For click functionality */
        if('steps' in moveData) {
            if (!moveData['steps']) {    
                console.log('step end');
                currentMovement = null;
               
            } 
            moveData.steps = moveData.steps-0.5;
        }
    }


    currentFrame++
    currentFrame %= frameNumber;
}

function setChar(x, y) {
    $("#player").css({
        'background-position-x': `${x}%`,
        'background-position-y': `${y}%`
    });
}

function standing() {
    x = frameWidth * 7;
    y = frameHeight * 3;
    setChar(x,y)
}

function getDistance(clickedX, clickedY) {
    let distanceX = clickedX - parseFloat(player.style["left"]) ;
    let distanceY = clickedY - parseFloat(player.style["top"]);
    
    return [distanceX, distanceY, 2 * Math.sqrt(((distanceX ) ** 2 + (distanceY) ** 2))];
}

function showClickEffect(rect, x, y){
    let d = Object.assign(document.createElement("div"), {"className": "clickEffect"});
    d.style.top= parseFloat(y) + "%";
    d.style.left= parseFloat(x) + "%";
    rect.appendChild(d);
    d.addEventListener('animationend',function(){d.parentElement.removeChild(d);}.bind(this));
}

window.addEventListener('keydown', e => { currentMovement = JSON.parse(JSON.stringify(lookup[e.key])) });
window.addEventListener('keyup', e => {
    currentMovement = null;
    currentFrame=7;
});
document.addEventListener('click', e => {
    // Get the target
    const target = document.getElementById("walkway");
    // Get the bounding rectangle of target
    const rect = target.getBoundingClientRect();

    console.log(e.target);

       // Check if the click event occurred within the 'walkway' div
    if (!target.contains(e.target)) {
        return;  // If the click is outside 'walkway', do nothing
    }

    // Mouse position
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const clickedX = x / rect.width * 100;
    const clickedY = y / rect.height * 100;
    console.log({x, y, clickedX, clickedY});

    let [xDistance, yDistance, distance] = getDistance(clickedX, clickedY)

    let angle = Math.atan2(yDistance, xDistance) * 180 / Math.PI;

    console.log(angle);

    let deltaX = xDistance / distance;
    let deltaY = yDistance / distance;
    
    currentMovement = {'style': {'top': deltaY, 'left': deltaX}, 'row': getDirection(angle), "steps": Math.floor(distance)};
    showClickEffect(target, clickedX, clickedY);
    }
)
};