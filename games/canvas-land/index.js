const socketer = require('../../scripts/socketer');
const namespace = "/canvas-land";

var lines = [];

function start() { 
    socketer.addListener(namespace, "add-line", (data, socket, nsp) => {
        if (data) {
            let line = Line(data.x0, data.y0, data.x1, data.y1, data.width, data.color);
            nsp.emit("line-added", line);
        }
    });
}

function Line(x0, y0, x1, y1, width, color) {
    if (!x0) x0 = 0;
    if (!y0) y0 = 0;
    if (!x1) x1 = 0;
    if (!y1) y1 = 0;
    if (!width) width = 5;
    if (!color) color = "black";
    let line = {
        x0: x0,
        y0: y0,
        x1: x1,
        y1: y1,
        width: width,
        color: color
    };
    lines.push(line);
    return line;
}

module.exports.start = start;
module.exports.getLines = () => {
    return lines;
};