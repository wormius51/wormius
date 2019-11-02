var selectedPlatform;
var lastPlatform;
var firstPlatform;
var selectScaleFactor = 1.05;
const pentaAngle = 2 * Math.PI / 5;

function clearAllPlatforms() {
    if (!lastPlatform) return;
    clearPlatform(lastPlatform);
    lastPlatform = undefined;
    firstPlatform = undefined;
}

function clearPlatform(platform) {
    animator.removeAnimation(platform.animation);
    for (let i = 0; i < 5; i++) {
        let item = platform.items[i];
        if (item) {
            animator.removeAnimation(item.animation);
            if (item.interval) {
                clearInterval(item.interval);
            }
        }
    }
    if (platform.child) {
        clearPlatform(platform.child);
    }
}

function Platform(items, rotationIndex) {
    if (!rotationIndex) rotationIndex = 0;
    let sprite = pentagramSprite;
    if (lastPlatform) {
        sprite = platformSprite;
    }
    let platform = {
        items: [undefined, undefined, undefined, undefined, undefined],
        child: lastPlatform,
        sprite: sprite,
        rotation: rotationIndex * pentaAngle,
        rotationIndex: rotationIndex,
        animation: undefined
    };
    if (items) {
        platform.items = items;
        for (let i = 0; i < 5; i++) {
            let item = items[i];
            if (item) {
                item.platform = platform;
                item.index = i;
            }
        }
    }
    if (platform.child) {
        platform.child.parent = platform;
    }
    lastPlatform = platform;
    if (!firstPlatform) {
        firstPlatform = platform;
    }
    return platform;
}

function resizeItems(platform) {
    for (let i = 0; i < 5; i++) {
        let item = platform.items[i];
        if (item) {
            let scale = window.innerHeight * 0.15;
            item.animation.height = scale;
            item.animation.width = scale;
        }
    }
}


function renderPlatform(x, y, width, height, platform) {
    if (!platform) platform = lastPlatform;
    if (!x) x = animator.canvas.width / 2;
    if (!y) y = animator.canvas.height / 2;
    if (!width) width = animator.canvas.height * 0.99;
    if (!height) height = animator.canvas.height * 0.99;
    resizeItems(platform);
    if (platform.child) {
        platform.animation = animator.Animation(platform.sprite, 1, 0, x, y, width, height, true, true);
        let decreace = window.innerHeight * 0.25;
        renderPlatform(x, y, width - decreace, height - decreace, platform.child);
    } else {
        platform.animation = animator.Animation(platform.sprite, 10, 5, x, y, width, height, true, true);
        rotatePlatform(lastPlatform);
    }
    rotateItems(platform);
}

function selectPlatform(x, y, platform) {
    if (!platform) platform = lastPlatform;
    let dx = x - platform.animation.x;
    let dy = y - platform.animation.y;
    let radLength = platform.animation.width / 2.3;
    if (Math.pow(dx, 2) + Math.pow(dy, 2) <= Math.pow(radLength, 2)) {
        selectedPlatform = platform;
    }
    if (platform.child) {
        selectPlatform(x, y, platform.child);
    } else {
        scaleUpPlatform();
    }
    rotatePlatform(platform);
}

function rotatePlatform(platform, dr, parentsRotation) {
    platform.animation.rotation = platform.rotation;
    if (parentsRotation == undefined) {
        parentsRotation = getParentsRotation(platform);
    }
    platform.animation.rotation += parentsRotation;
    if (dr) {
        platform.animation.rotation += dr;
    }
    if (platform.child) {
        rotatePlatform(platform.child, dr, parentsRotation + platform.rotation);
    }
    rotateItems(platform, dr, parentsRotation);
}

function rotateItems(platform, dr, parentsRotation) {
    let x = platform.animation.x;
    let y = platform.animation.y;
    if (!dr) dr = 0;
    if (!parentsRotation) parentsRotation = 0;
    let radLength = platform.animation.width / 2.3;
    for (let i = 0; i < platform.items.length; i++) {
        let item = platform.items[i];
        if (item) {
            let angle = platform.rotation + pentaAngle * i + dr + parentsRotation;
            item.animation.rotation = angle;
            if (item.direction == "in") {
                item.animation.rotation += Math.PI;
            }
            angle = -angle;
            item.animation.x = x;
            item.animation.y = y;
            item.animation.x += radLength * Math.sin(angle);
            item.animation.y += radLength * Math.cos(angle);

        }
    }
}

function fixPlatformRotation(platform, dr) {
    if (!platform) {
        platform = selectedPlatform;
    }
    platform.rotation += dr;
    platform.rotation = platform.rotation % (2 * Math.PI);
    if (platform.rotation < 0) {
        platform.rotation = Math.PI * 2 + platform.rotation;
    }
    let newRotationIndex = Math.round(platform.rotation / pentaAngle);
    newRotationIndex = newRotationIndex % 5;
    let changed = newRotationIndex != platform.rotationIndex;
    if (changed) {
        undoButton.visible = true;
        moveHistory.push(getLevelString());
        drawUi();
    }
    platform.rotationIndex = newRotationIndex;
    platform.rotation = platform.rotationIndex * pentaAngle;
    if (changed) {
        activateItems(lastPlatform);
        checkWin();
        setTimeout(() => {
            currentPosition = getLevelString();
        }, 10);
    }
    scaleDownPlatform();
    rotatePlatform(platform, 0);
}

function getParentsRotation(platform) {
    if (!platform) {
        platform = selectedPlatform;
    }
    if (platform.parent) {
        return platform.parent.rotation + getParentsRotation(platform.parent);
    } else {
        return 0;
    }
}

function scaleUpPlatform(platform) {
    if (!selectedPlatform) return;
    if (!platform) {
        platform = selectedPlatform;
    }
    platform.animation.height *= selectScaleFactor;
    platform.animation.width *= selectScaleFactor;
    if (platform.child) {
        scaleUpPlatform(platform.child);
    }
}

function scaleDownPlatform(platform) {
    if (!platform) {
        platform = selectedPlatform;
    }
    platform.animation.height /= selectScaleFactor;
    platform.animation.width /= selectScaleFactor;
    if (platform.child) {
        scaleDownPlatform(platform.child);
    }
}

function activateItems(platform) {
    let items = [];
    while (platform) {
        for (let i = 0; i < 5; i++) {
            let item = platform.items[i];
            if (item) {
                items.push(item);
            }
        }
        platform = platform.child;
    }
    items = items.sort((a, b) => {
        return b.priority - a.priority;
    });
    items.forEach(item => {
        item.act();
    });
}