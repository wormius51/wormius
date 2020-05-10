const hornetColor = "FFA0";
const hornetAvoidRange = 3;

function spawnHornet(x, y, direction) {
    for (let dy = -1; dy < 2; dy++) {
        for (let dx = -1; dx < 2; dx++) {
            if (!currentPixelsMatrix[y + dy][x + dx].match("#000000")) {
                return;
            }
        }
    }
    if (!direction)
        direction = 0;
    currentPixelsMatrix[y][x] = "#" + hornetColor + "0" + direction;
}

function moveHornet(i, j, defaultPixel) {
    let currenPixel = currentPixelsMatrix[i][j];
    let nextPixel = defaultPixel;
    if (currenPixel.substr(0,5).match("#" + hornetColor)) {
        return "#000000";
    }
    if (i > 0) {
        // move down
        if (currentPixelsMatrix[i - 1][j].match("#" + hornetColor + "00")) {
            nextPixel = currentPixelsMatrix[i - 1][j];
        } else
        // move down right
        if (j > 0) {
            if (currentPixelsMatrix[i - 1][j - 1].match("#" + hornetColor + "01")) {
                nextPixel = currentPixelsMatrix[i - 1][j - 1];
            }
        } 
        // move down left
        if (j < columns - 1) {
            if (currentPixelsMatrix[i - 1][j + 1].match("#" + hornetColor + "07")) {
                nextPixel = currentPixelsMatrix[i - 1][j + 1];
            }
        }
    }
    if (i < rows - 1) {
        // move up
        if (currentPixelsMatrix[i + 1][j].match("#" + hornetColor + "04")) {
            nextPixel = currentPixelsMatrix[i + 1][j];
        } else
        // move up right
        if (j > 0) {
            if (currentPixelsMatrix[i + 1][j - 1].match("#" + hornetColor + "03")) {
                nextPixel = currentPixelsMatrix[i + 1][j - 1];
            }
        }
        // move up left
        if (j < columns - 1) {
            if (currentPixelsMatrix[i + 1][j + 1].match("#" + hornetColor + "05")) {
                nextPixel = currentPixelsMatrix[i + 1][j + 1];
            }
        }
    }
    // move right
    if (j > 0) {
        if (currentPixelsMatrix[i][j - 1].match("#" + hornetColor + "02")) {
            nextPixel = currentPixelsMatrix[i][j - 1];
        }
    }
    // move left
    if (j < columns - 1) {
        if (currentPixelsMatrix[i][j + 1].match("#" + hornetColor + "06")) {
            nextPixel = currentPixelsMatrix[i][j + 1];
        }
    }
    if (nextPixel.substr(0,5).match("#" + hornetColor)) {
        // if an obsticle is ditected. tun around.
        nextPixel = rotateDirection(nextPixel, i, j);
    }
    return nextPixel;
}

function rotateDirection(pixel, i, j) {
    let nextPixel = pixel;
    let direction = pixel.substr(6) * 1;
    if (i < hornetAvoidRange || rows - i <= hornetAvoidRange
        || j < hornetAvoidRange || columns - j <= hornetAvoidRange) {
        
        direction++;
        if (direction > 7)
            direction = 0;
        
    }
    // avoid other hornets
    switch (direction) {
        case 0:
        case 1:
        case 7:
            if (i < rows - hornetAvoidRange) {
                for (let x = -1; x < 2; x++) {
                    if (j + x > columns - 1 || j + x < 0)
                        continue;
                    if (currentPixelsMatrix[i + hornetAvoidRange][j + x].substr(0,5).match("#" + hornetColor)) {
                        direction++;
                    }
                }
            }
            break;
        case 3:
        case 4:
        case 5:
            if (i > hornetAvoidRange) {
                for (let x = -1; x < 2; x++) {
                    if (j + x > columns - 1 || j + x < 0)
                        continue;
                    if (currentPixelsMatrix[i - hornetAvoidRange][j + x].substr(0,5).match("#" + hornetColor)) {
                        direction++;
                    }
                }
            }
            break;
        case 2:
            if (j < columns - hornetAvoidRange) {
                for (let y = -1; y < 2; y++) {
                    if (i + y > rows - 1 || i + y < 0)
                        continue;
                    if (currentPixelsMatrix[i + y][j + hornetAvoidRange].substr(0,5).match("#" + hornetColor)) {
                        direction++;
                    }
                }
            }
            break;
        case 6:
            if (j > hornetAvoidRange) {
                for (let y = -1; y < 2; y++) {
                    if (i + y > rows - 1 || i + y < 0)
                        continue;
                    if (currentPixelsMatrix[i + y][j - hornetAvoidRange].substr(0,5).match("#" + hornetColor)) {
                        direction++;
                    }
                }
            }
            break;
    }
    nextPixel = pixel.substr(0,6) + direction;
    
    return nextPixel;
}