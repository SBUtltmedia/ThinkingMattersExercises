// Fix aspect ratio of the stage
window.addEventListener('resize', function() {
    resizeWindow();
});

const ASPECT=16/9;
// Resize the window
function resizeWindow() {

    // Get window width and height
    var w = window.innerWidth//$(window).width();
    var h = window.innerHeight//$(window).height();
    // If the aspect ratio is greater than or equal to 4:3, fix height and set width based on height
    if ((w / h) >= ASPECT) {
        stageHeight = h;
        stageWidth = (ASPECT) * h;
        stageLeft = (w - stageWidth) / 2;
        stageTop = 0;
        coverTop = 0;
        coverBottom = 0;
        coverLeft = stageLeft;
        coverRight = stageLeft;
    }
    // If the aspect ratio is less than 4:3, fix width and set height based on width
    else {
        stageWidth = w;
        stageHeight = (1/ASPECT) * w;
        stageTop = (h - stageHeight) / 2;
        stageLeft = 0;
        coverTop = stageTop;
        coverBottom = stageTop;
        coverLeft = 0;
        coverRight = 0;
    }

    // Set "screen" object width and height to stageWidth and stageHeight, and center screen
    let screen = document.getElementById('screen').style;
    screen = Object.assign(screen, { width: stageWidth + "px",
        height: stageHeight + "px",
        left:   stageLeft + "px" })
    
    let htmlStyle  = document.getElementsByTagName('html')[0].style;
    htmlStyle = Object.assign(htmlStyle, {"font-size": `${(stageHeight / 20)}px`} )
}

