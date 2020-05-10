const flowerColor = "FF00FF";

function spawnFlower(x, y) {
    for (let dy = -1; dy < 2; dy++) {
        for (let dx = -1; dx < 2; dx++) {
            if ((dy == 0 || dx == 0) && currentPixelsMatrix[y + dy] && currentPixelsMatrix[y + dy][x + dx]) {
                if (currentPixelsMatrix[y + dy][x + dx].match("#000000")) {
                    currentPixelsMatrix[y + dy][x + dx] = "#" + flowerColor;
                }
            }
        }
    }
}