 
var images = [];

var imagesNames = [
    "gentelCube",
    "ninja",
    "dummy",
    "nine",
    "up",
    "left",
    "right"
];

imagesNames.forEach(name => {
    images[name] = new Image();
    images[name].src = "images/" + name + ".png";
});