let player;
let currentMovement = null;
let playerWidth = 0
let playerHeight = 0
let currentFrame = 7;
let frameNumber = 24;
let frameWidth = 100 / (frameNumber - 1);
let frameHeight = 100 / 3;
let lastE = null;
const movePlayer = .60;
let lookup = {
    'w': { 'style': 'top', 'charge': -movePlayer, 'column': 2 },
    's': { 'style': 'top', 'charge': movePlayer, 'column': 3 },
    'a': { 'style': 'left', 'charge': -movePlayer, 'column': 1 },
    'd': { 'style': 'left', 'charge': movePlayer, 'column': 0 }
}

let collisionCallbacks = {
    "box1": () => { console.log(1); },
    "box2": () => { console.log(2) },
    "box3": () => { console.log(3) },
    "box4": () => { console.log(4) },
    "box5": () => { console.log(5) },
}

$(setTimeout(init,1000))

function init(){
    resizeWindow();
player = document.getElementById('player');
player.style.left = "5%"
player.style.top = "5%"



move()
function move() {
    requestAnimationFrame(() => {
        if (currentMovement) { moveChar(currentMovement) }
        else { standing() }
        move()
    }
    )
}

let collidables = document.querySelectorAll(".collidable")

collidables.forEach((el, id) => {

    let itemLeft = Math.random() * 100;
    let itemTop = Math.random() * 100;
    el.style.left = `${itemLeft}%`;
    el.style.top = `${itemTop}%`;

})


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
    collidables.forEach((el, id) => { if (overlaps(player, el)) { collisionCallbacks[el.id]() } })

    let style = moveData['style']
    let charge = moveData['charge']
    let column = moveData['column']
    player.style[style] =( (parseFloat(player.style[style]) + charge)+100) %100 + '%';
    let discharge = (parseFloat(player.style[style]) + charge +100) %100 + '%';
    console.log(discharge)
    console.log(player.style[style])
    x = frameWidth * currentFrame
    y = frameHeight * column
    setChar(x,y)

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

window.addEventListener('keydown', e => { currentMovement = lookup[e.key] });
window.addEventListener('keyup', e => {
    currentMovement = null;
    currentFrame=7;
});
}