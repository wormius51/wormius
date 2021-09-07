const startPositionFen = document.getElementById("startPosition").innerHTML;

function loadPuzzle (puzzle) {
    if (!puzzle)
        return;
    puzzle = decodeURI(puzzle);
    startPosition = fenToPosition(puzzle);
    restart();
}

window.addEventListener('load', () => {
    loadPuzzle(startPositionFen);
});