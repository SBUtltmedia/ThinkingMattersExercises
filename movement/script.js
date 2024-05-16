const player = document.getElementById('player');
player.style.left="50rem"
player.style.top="50rem"
const movePlayer = 1;

window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'a':
            player.style.left = parseInt(player.style?.left||0) - movePlayer + 'rem';
            break;
        case 'd':
            player.style.left = parseInt(player.style?.left||0) + movePlayer + 'rem';
            break;
        case 'w':
            player.style.top = parseInt(player.style?.top||0) - movePlayer + 'rem';
            break;
        case 's':
            player.style.top = parseInt(player.style?.top||0) + movePlayer + 'rem';
            break;
    }
});
