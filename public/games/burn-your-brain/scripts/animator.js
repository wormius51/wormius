function Sprite (image, width, height, centerX, centerY, paddingX, paddingY) {
    if (!width) width = image.width;
    if (!height) height = image.height;
    if (!centerX) centerX = width / 2;
    if (!centerY) centerY = height / 2;
    if (!paddingX) paddingX = 0;
    if (!paddingY) paddingY = 0;
    return {
        image: image,
        width: width,
        height: height,
        centerX: centerX,
        centerY: centerY,
        paddingX: paddingX,
        paddingY: paddingY
    };
}

function drawSprite(context ,sprite, x, y, index, width, height, rotation, rowIndex) {
    if (!width) width = sprite.width;
    if (!height) height = sprite.height;
    if (!rowIndex) rowIndex = 0;
    try {
        context.translate(x, y);
        context.rotate(rotation);
        let centerX = sprite.centerX * width / sprite.width;
        let centerY = sprite.centerY * height / sprite.height;
        context.drawImage(
            sprite.image,
            sprite.paddingX + (sprite.width + sprite.paddingX) * index,
            sprite.paddingY + (sprite.height + sprite.paddingY) * rowIndex,
            sprite.width,
            sprite.height,
            - centerX,
            - centerY,
            width,
            height
        );
        context.rotate(-rotation);
        context.translate(-x, -y);

    } catch (e) {
        console.log(e);
    }
}

/**
 * Creates an Animator object.
 * @param {HTMLCanvasElement} [canvas] The canvas to draw the animations on.
 * @param {Number} [framerate] How many frames per second.
 * @returns {Animator} The new Animator.
 */
function Animator(canvas, framerate) {
    if (!framerate) framerate = 60;
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
        canvas.style.position = 'absolute';
        canvas.style.top = 0 + "px";
        canvas.style.left = 0 + "px";
        document.body.appendChild(canvas);
    }
    let animator = {
        canvas: canvas,
        context: canvas.getContext('2d'),
        framerate: framerate,
        terminated: false,
        animations: [],
        /**
         * Returns a sprite of the image.
         * 
         */
        Sprite: (image, width, height, centerX, centerY) => {
            if (!width) width = image.width;
            if (!height) height = image.height;
            if (!centerX) centerX = width / 2;
            if (!centerY) centerY = height / 2;
            return {
                image: image,
                width: width,
                height: height,
                centerX: centerX,
                centerY: centerY
            };
        },
        Animation: (sprite, length, framerate, x, y, width, height, playing, looping) => {
            if (!length) length = 1;
            if (playing == undefined) playing = true;
            if (looping == undefined) looping = true;
            if (x == undefined) x = 0;
            if (y == undefined) y = 0;
            if (!width) width = sprite.width;
            if (!height) height = sprite.height;
            let animation = {
                frameIndex: 0,
                sprite: sprite,
                length: length,
                framerate: framerate,
                looping: looping,
                playing: playing,
                x: x,
                y: y,
                width: width,
                height: height,
                progress: 0,
                rotation: 0,
                zIndex: 0,
                rowIndex: 0
            };
            animator.animations.push(animation);
            return animation;
        },
        removeAnimation: (animation) => {
            animator.animations = animator.animations.filter(a => {
                return a !== animation;
            });
        },
        drawSprite: (sprite, x, y, index, width, height, rotation, rowIndex) => {
            drawSprite(animator.context, sprite, x, y, index, width, height, rotation, rowIndex);
        },
        frame: (framerate) => {
            if (animator.terminated) return;
            if (framerate) animator.framerate = framerate;
            else framerate = animator.framerate;
            animator.animations = animator.animations.sort((a, b) => {
                return a.zIndex - b.zIndex;
            });
            animator.context.clearRect(0, 0, animator.canvas.width, animator.canvas.height);
            animator.animations.forEach(animation => {
                if (animation.playing) {
                    animator.drawSprite(animation.sprite, animation.x, animation.y, animation.frameIndex, animation.width, animation.height, animation.rotation, animation.rowIndex);
                    if (animation.progress > 1000 / animation.framerate) {
                        animation.frameIndex++;
                        animation.progress = 0;
                    } else {
                        animation.progress += 1000 / animator.framerate;
                    }

                    if (animation.frameIndex >= animation.length) {
                        animation.playing = animation.looping;
                        if (!animation.playing) animation.lastPlayed = -1;
                        animation.frameIndex = 0;
                    }
                }
            });
            setTimeout(animator.frame, 1000 / framerate);
        },
        terminate: () => {
            animator.terminated = true;
            animator.canvas.remove();
        },
        dropDown: (framerate) => {
            if (!this.y) y = 0;
            if (framerate) animator.framerate = framerate;
            else framerate = animator.framerate;
            this.y += framerate / 2;
            animator.canvas.style.top = y + "px";
            if (y >= window.innerHeight) {
                animator.terminate();
                return;
            }
            setTimeout(animator.dropDown, 1000 / framerate);
        }
    };
    return animator;
}