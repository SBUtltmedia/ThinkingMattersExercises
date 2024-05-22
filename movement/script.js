const player = document.getElementById('player');
player.style.left = "0rem"
player.style.top = "0rem"
const movePlayer = 1.0;
let playerWidth = 0
let playerHeight = 0
let currentFrame;
let frameNumber = 24;
let frameWidth = 100/(frameNumber-1);
let frameHeight = 100/3;
let lastE = null;
lookup = {
    'w': { 'style': 'top', 'charge': -movePlayer, 'column': 2 },
    's': { 'style': 'top', 'charge': movePlayer, 'column': 3 },
    'a': { 'style': 'left', 'charge': -movePlayer, 'column': 1 },
    'd': { 'style': 'left', 'charge': movePlayer, 'column': 0 }
}


window.addEventListener('keydown', (e) => {

    if (e.key != lastE) {
        currentFrame = 7;
    }
    let style = lookup[e.key]['style']
    let charge = lookup[e.key]['charge']
    let column = lookup[e.key]['column']
    player.style[style] = parseFloat(player.style[style]) + charge + '%';
    $("#player").css({
        'background-position-x': `${frameWidth * currentFrame}%`,
        'background-position-y': `${frameHeight * column}%`
    });

    lastE = e.key;
    currentFrame++
    currentFrame %= frameNumber;

});
