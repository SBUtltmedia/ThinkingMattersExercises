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
    'w': { 'style': {'top': -1 , 'left': .3} , 'row': 2 },
    's': { 'style': {'top': 1 , 'left': 0}, 'row': 3 },
    'a': { 'style': {'top': -.3 , 'left': -1}, 'row': 1 },
    'd': { 'style': {'top': 0 , 'left': 1}, 'row': 0 }
}

let collisionCallbacks = {
    "box1": () => {  SugarCube.Engine.play("2_2") },
    "box2": () => { console.log(2) },
    "box3": () => { console.log(3) },
    "box4": () => { console.log(4) },
    "box5": () => { console.log(5) },
}

// $(setTimeout(init,1000))
// $(document).on(':passagestart', (ev) => {
//     init();
//     //fade($("#passages"), 1);
// })
init();

function init(){

    // $(document).on(':passagedisplay', function (ev) {
    //     console.log('passage start');
    //     resizeWindow();
    // });
   player = document.getElementById('player');
    if(!player) {
    
        setTimeout(init, 100);
        return;
    }
    else{
  tryResize();
    }
    player.style.left = "5%"
    player.style.top = "5%"
    SugarCube.Engine.play('0_0');


//     'display': 'block'
// })

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
    collidables.forEach(
        (el, id) => { 
            if (overlaps(player, el)) { 
                collisionCallbacks[el.id]() 
            } 
        })

    for (i of ["left","top"])
        {
    player.style[i]=( (parseFloat(player.style[i])+moveData['style'][i] )+100) %100 + '%';
        }
    x = frameWidth * currentFrame
    y = frameHeight * moveData['row']
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