const joystick = document.getElementById("joystick");
const knob = document.getElementById("knob");

const joystickTransform = {
    x: 100,
    y: 530,
    radius: 64
};

joystick.style.width = (joystickTransform.radius * 2) + "px";
joystick.style.height = (joystickTransform.radius * 2) + "px";
joystick.style.top = (joystickTransform.y - joystickTransform.radius) + "px";
joystick.style.left = (joystickTransform.x - joystickTransform.radius) + "px";

knob.style.width = joystickTransform.radius + "px";
knob.style.height = joystickTransform.radius + "px";
knob.style.top = (joystickTransform.radius / 2) + "px";
knob.style.left = (joystickTransform.radius / 2) + "px";

const controls = {
    horizontal: 0,
    vertical: 0
};

function moveKnob() {
    knob.style.top = ((0.5 + controls.vertical) * joystickTransform.radius) + "px";
    knob.style.left = ((0.5 + controls.horizontal) * joystickTransform.radius) + "px";
}

window.addEventListener('mousemove', event => {
    controls.horizontal = (event.clientX - joystickTransform.x) / joystickTransform.radius;
    controls.vertical = (event.clientY - joystickTransform.y) / joystickTransform.radius;
    let normal = Math.sqrt(Math.pow(controls.horizontal, 2) + Math.pow(controls.vertical, 2));
    if (normal > 1) {
        controls.horizontal /= normal;
        controls.vertical /= normal;
    }
    moveKnob();
});

joystick.addEventListener('mouseleave', event => {
    
});