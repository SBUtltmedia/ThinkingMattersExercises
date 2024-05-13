const player = document.getElementById('player');

const movePlayer = 10;

window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'a':
            player.style.left = parseInt(player.style?.left||0) - movePlayer + 'px';
            break;
        case 'd':
            player.style.left = parseInt(player.style?.left||0) + movePlayer + 'px';
            break;
        case 'w':
            player.style.top = parseInt(player.style?.top||0) - movePlayer + 'px';
            break;
        case 's':
            player.style.top = parseInt(player.style?.top||0) + movePlayer + 'px';
            break;
    }
});
