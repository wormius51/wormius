const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

function gameFullScreen() {
    document.getElementsByClassName("game-container")[0].children[0].requestFullscreen();
    screen.orientation.lock('landscape');
}