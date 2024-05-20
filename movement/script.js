const player = document.getElementById('player');
player.style.left="0rem"
player.style.top="0rem"
const movePlayer = 1;
let playerWidth = 0
let playerHeight = 0
let currentFrame;
let frameNumber = 23;
let frameWidth= 4.34;
let frameHeight=33;
let lastE=null;
lookup = {
    'w':{'style':'top', 'charge': -movePlayer, 'column':2},
    's':{'style':'top', 'charge': movePlayer, 'column':3},
    'a':{'style':'left', 'charge': -movePlayer, 'column':1},
    'd':{'style':'left', 'charge': movePlayer, 'column':0}
}


window.addEventListener('keydown', (e) => {
    
    if (e.key!=lastE){
        currentFrame=7;
    }
    let style = lookup[e.key]['style']
    let charge = lookup[e.key]['charge']
    let column= lookup[e.key]['column']
    player.style[style] = parseInt(player.style[style]||0) + charge + '%';
    left = 
    $("#player").css({
        'background-position-x': `${frameWidth * currentFrame}%`,
        'background-position-y':`${frameHeight*column}%`
    });
    console.log(`${6.5 * currentFrame}% ${33*column}%`)
    lastE=e.key;
currentFrame++
    currentFrame%=frameNumber;
    // switch (e.key) {
    //     case 'a':
    //         player.style = parseInt(player.style?.left||0) - movePlayer + 'rem';
    //         break;
    //     case 'd':
    //         player.style.left = parseInt(player.style?.left||0) + movePlayer + 'rem';
    //         break;
    //     case 'w':
    //         player.style.top = parseInt(player.style?.top||0) - movePlayer + 'rem';
    //         break;
    //     case 's':
    //         player.style.top = parseInt(player.style?.top||0) + movePlayer + 'rem';
    //         break;
    // }
});
