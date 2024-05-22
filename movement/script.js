const player = document.getElementById('player');
player.style.left = "0rem"
player.style.top = "0rem"
const movePlayer = .60;
let currentMovement = null;
let playerWidth = 0
let playerHeight = 0
let currentFrame = 7;
let frameNumber = 24;
let frameWidth = 100 / (frameNumber - 1);
let frameHeight = 100 / 3;
let lastE = null;
lookup = {
    'w': { 'style': 'top', 'charge': -movePlayer, 'column': 2 },
    's': { 'style': 'top', 'charge': movePlayer, 'column': 3 },
    'a': { 'style': 'left', 'charge': -movePlayer, 'column': 1 },
    'd': { 'style': 'left', 'charge': movePlayer, 'column': 0 }
}
move()
function move() {
    requestAnimationFrame(() => {
        if (currentMovement) { moveChar(currentMovement) }
        move()
    }
    )
}




function moveChar(e) {
    console.log(e)
    let style = lookup[e.key]['style']
    let charge = lookup[e.key]['charge']
    let column = lookup[e.key]['column']
    player.style[style] = parseFloat(player.style[style]) + charge + '%';
    $("#player").css({
        'background-position-x': `${frameWidth * currentFrame}%`,
        'background-position-y': `${frameHeight * column}%`
    });
    currentFrame++
    currentFrame %= frameNumber;

}

window.addEventListener('keydown', e => { currentMovement = e });
window.addEventListener('keyup', e => {
    currentMovement = null;
    currentFrame=7;
});