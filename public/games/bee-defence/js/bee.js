const beeColor = "FFFF00";

var requiredSpawnEnergy = 10;
var energy = 0;

function spawnBee(x, y) {
    currentPixelsMatrix[y][x] = "#" + beeColor;
}

function moveBee(i, j, defaultPixel) {
    let dx = controls.horizontal >= 0.5 ? -1 : (controls.horizontal <= -0.5 ? 1 : 0);
    let dy = controls.vertical >= 0.5 ? -1 : (controls.vertical <= -0.5 ? 1 : 0);
    if (i + dy >= 0 && i + dy < rows && j + dx >= 0 && j + dx < columns) {
        if (currentPixelsMatrix[i + dy][j + dx].match("#" + beeColor)) {
            if (currentPixelsMatrix[i][j].match("#" + flowerColor)) {
                changeScore(1);
                energy++;
                if (energy >= requiredSpawnEnergy) {
                    energy = 0;
                    spawnBee(Math.floor(Math.random() * columns), Math.floor(Math.random() * rows))
                }
            }
            return "#" + beeColor;
        }
    }

    if (dx == 0 && dy == 0) {
        return defaultPixel;
    } else if (currentPixelsMatrix[i][j].match("#" + beeColor)) {
        return "#000000";
    }

    return currentPixelsMatrix[i][j];
}