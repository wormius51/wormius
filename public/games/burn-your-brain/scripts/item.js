
function Item(name, direction, lit, animation, act, onChangeLit) {
    if (!name) name = "item";
    if (!direction) direction = "in";
    if (!lit) lit = false;
    if (animation) animation.zIndex = 1;
    let item = {
        name: name,
        direction: direction,
        lit: lit,
        animation: animation,
        setLit: lit => {
            let changed = lit != item.lit;
            item.lit = lit;
            if (item.onChangeLit && changed) {
                item.onChangeLit(lit);
            }
        },
        onChangeLit: onChangeLit,
        act: act,
        priority: 0
    };
    return item;
}

function Candle(lit) {
    let animation = animator.Animation(candleSprite, 1, 8, 200, 200, 100, 100, true, true);
    if (lit) {
        animation.rowIndex = 1;
        animation.length = 4;
    }
    let candle = Item("candle", "in", lit, animation,
        (platform, i) => {
            if (!candle.lit) return;
            if (i == undefined) i = candle.index;
            if (!platform) platform = candle.platform;
            if (platform.child) {
                let j = i - platform.child.rotationIndex;
                if (j < 0) {
                    j = 5 + j;
                }
                let item = platform.child.items[j];
                if (item) {
                    item.setLit(true);
                }
            }
            if (platform.parent) {
                let j = i + platform.rotationIndex;
                if (j > 4) {
                    j = j - 5;
                }
                let item = platform.parent.items[j];
                if (item) {
                    item.setLit(true);
                }
            }
        },
        lit => {
            animation.rowIndex = lit ? 1 : 0;
            animation.length = lit ? 4 : 1;
            if (lit) {
                candle.act(candle.platform, candle.index);
            }
        }
    );
    return candle;
}

function GoldenCandle(lit) {
    let goldenCandle = Candle(lit);
    goldenCandle.animation.sprite = candleGoldenSprite;
    goldenCandle.gold = true;
    return goldenCandle;
}

function FlameLing(lit, direction) {
    let animation = animator.Animation(flamelingSprite, 6, 8, 200, 200, 100, 100, true, true);
    if (lit) {
        animation.rowIndex = 1;
    }
    let flameLing = Item("flameling", direction, lit, animation,
        (platform, i) => {
            if (i == undefined) i = flameLing.index;
            if (!platform) platform = flameLing.platform;
            if (!flameLing.lit) return;
            if (!flameLing.ready) {
                flameLing.ready = true;
                return;
            }
            if (flameLing.direction == "in") {
                if (platform.child) {
                    let j = i - platform.child.rotationIndex;
                    if (j < 0) {
                        j = 5 + j;
                    }
                    flameLing.swollow(platform, i, platform.child, j);
                }
            } else {
                if (platform.parent) {
                    let j = i + platform.rotationIndex;
                    if (j > 4) {
                        j = j - 5;
                    }
                    flameLing.swollow(platform, i, platform.parent, j);
                }
            }
        },
        lit => {
            animation.rowIndex = lit ? 1 : 0;
            if (lit) {
                if (!flameLing.interval) {
                    flameLing.interval = setInterval(() => {
                        if (flameLing.lit) {
                            if (Math.random() < 0.3) {
                                flameLing.animation.rowIndex = 2;
                                flameLing.timeOut = setTimeout(() => {
                                    if (flameLing.lit) {
                                        flameLing.animation.rowIndex = 1;
                                    }
                                }, 1000);
                            }
                        }
                    }, 5000);
                }
            } else {
                if (flameLing.interval) {
                    clearInterval(flameLing.interval);
                    flameLing.interval = undefined;
                    if (flameLing.timeOut) {
                        clearTimeout(flameLing.timeOut);
                        flameLing.timeOut = undefined;
                    }
                }
                flameLing.ready = false;
                flameLing.animation.rowIndex = 0;
            }
        }
    );
    flameLing.swollow = (platform, i, newPlat, j) => {
        let item = newPlat.items[j];
        if (item) {
            if (item.name == "candle") {
                newPlat.items[j] = flameLing;
                platform.items[i] = undefined;
                item.animation.playing = false;
                flameLing.platform = newPlat;
                flameLing.index = j;
                flameLing.act();
            }
        }
    };
    flameLing.priority = -2;
    if (lit) {
        flameLing.ready = true;
    }
    return flameLing;
}

function IceCube() {
    let animation = animator.Animation(iceCubeSprite, 6, 8, 200, 200, 100, 100, true, true);
    let iceCube = Item("iceCube", "in", false, animation,
        (platform, i) => {
            if (i == undefined) i = iceCube.index;
            if (!platform) platform = iceCube.platform;
            if (platform.child) {
                let j = i - platform.child.rotationIndex;
                if (j < 0) {
                    j = 5 + j;
                }
                let item = platform.child.items[j];
                if (item) {
                    item.setLit(false);
                }
            }
            if (platform.parent) {
                let j = i + platform.rotationIndex;
                if (j > 4) {
                    j = j - 5;
                }
                let item = platform.parent.items[j];
                if (item) {
                    item.setLit(false);
                }
            }
        });
    iceCube.priority = -1;
    return iceCube;
}

function Swap(lit,direction) {
    let animation = animator.Animation(swapSprite, 6, 8, 200, 200, 100, 100, true, true);
    let swap = Item("swap", direction, true, animation,
        (platform, i) => {
            if (i == undefined) i = swap.index;
            if (!platform) platform = swap.platform;
            if (swap.direction == "in") {
                if (platform.child) {
                    let j = i - platform.child.rotationIndex;
                    if (j < 0) {
                        j = 5 + j;
                    }
                    let item = platform.child.items[j];
                    if (item) {
                        swap.replace(platform, i, platform.child, j);
                    }
                }
            } else {
                if (platform.parent) {
                    let j = i + platform.rotationIndex;
                    if (j > 4) {
                        j = j - 5;
                    }
                    let item = platform.parent.items[j];
                    if (item) {
                        swap.replace(platform, i, platform.parent, j);
                    }
                }
            }
        });
    swap.priority = 1;
    swap.replace = (platform, i, newPlat, j) => {
        let item = newPlat.items[j];
        platform.items[i] = item;
        item.platform = platform;
        item.index = i;
        newPlat.items[j] = swap;
        swap.platform = newPlat;
        swap.index = j;
    }
    return swap;
}

const itemConstructors = {
    c: Candle,
    g: GoldenCandle,
    f: FlameLing,
    i: IceCube,
    s: Swap
};