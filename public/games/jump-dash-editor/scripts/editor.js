
var editorMode = false;

var selectedObject = undefined;
var selectionOffset = undefined;
var selectionOriginalScale = undefined;

var editorLevel = undefined;

//window.addEventListener('click', editorClick);
window.addEventListener('mousedown', editorMouseDown);
window.addEventListener('mouseup', editorMouseUp);
window.addEventListener('mousemove', editorMouseMove);

function editorClick (event) {
    if (!editorMode)
        return;
    let pos = screenToWorld(event.clientX, event.clientY);
    let g = lookForObject(pos);
    if (g) {
        if (editorControls.delete.pressed)
            g.destroy = true;
        else if (!editorControls.move.pressed && !editorControls.scale.pressed) {
            if (g.text) {
                let text = prompt("Object Text", g.text);
                if (text)
                    g.text = text;
            } else if (g.image) {
                let src = prompt("Image URL", "");
                if (src)
                    g.image.src = src;
            }
        }
    } else {
        if (editorControls.block.pressed)
            Block(pos, Vector2D(50, 50));
        else if (editorControls.gummy.pressed)
            Gummy(pos, Vector2D(50, 50));
        else if (editorControls.goal.pressed)
            Goal(pos);
        else if (editorControls.coin.pressed)
            Coin(pos);
        else if (editorControls.enemy.pressed)
            Enemy(pos);
        else if (editorControls.flyingEnemy.pressed)
            FlyingEnemy(pos);
        else if (editorControls.launcher.pressed)
            RocketLauncher(pos);
        else if (editorControls.upDash.pressed)
            UpDashPickup(pos);
        else if (editorControls.sideDash.pressed)
            SideDashPickup(pos);
        else if (editorControls.text.pressed) {
            let text = prompt("Object Text", "(;");
            if (text)
                TextObject(pos, text);
        } else if (editorControls.image.pressed) {
            let src = prompt("Image URL", "");
            if (src)
                ImageObject(pos, Vector2D(100, 100), src);
        }
    }
}

function editorMouseDown (event) {
    if (!editorMode)
        return;
    let pos = screenToWorld(event.clientX, event.clientY);
    selectedObject = lookForObject(pos);
    if (!selectedObject)
        return;
    selectionOffset = copyVector2D(pos);
    subVectors(selectionOffset, selectedObject.position);
    selectionOriginalScale = copyVector2D(selectedObject.scale);
}

function editorMouseUp (event) {
    if (!editorMode)
        return;
    selectedObject = undefined;
    selectionOffset = undefined;
    selectionOriginalScale = undefined;
}

function editorMouseMove (event) {
    if (!editorMode)
        return;
    if (!selectedObject)
        return;
    let pos = screenToWorld(event.clientX, event.clientY);
    if (editorControls.move.pressed) {
        selectedObject.position = copyVector2D(pos);
        subVectors(selectedObject.position, selectionOffset);
    } else if (editorControls.scale.pressed && selectedObject.scaleable) {
        let scaleChange = copyVector2D(pos);
        subVectors(scaleChange, selectedObject.position);
        subVectors(scaleChange, selectionOffset);
        selectedObject.scale = copyVector2D(selectionOriginalScale);
        addVectors(selectedObject.scale, scaleChange);
        if (selectedObject.scale.x < 0)
            selectedObject.scale.x *= -1;
        if (selectedObject.scale.y < 0)
            selectedObject.scale.y *= -1;
        if (selectedObject.text) {
            selectedObject.fontSize = selectedObject.scale.y / scaleRatio;
            selectedObject.fontSize = Math.min(selectedObject.fontSize, selectedObject.scale.x / 
                (scaleRatio * selectedObject.text.length * 0.4));
            
        }
    }
}

function screenToWorld (x, y) {
    let pos = copyVector2D(camera.position);
    let cursorOffset = Vector2D(x - gameCanvas.width / 2, y - gameCanvas.height / 2);
    let offset = Vector2D(50, 0);
    mulVectorNum(offset, 0.5);
    addVectors(cursorOffset, offset);
    mulVectorNum(cursorOffset, 1 / scaleRatio);
    addVectors(pos, cursorOffset);
    return pos;
}

function lookForObject (pos) {
    return gameObjects.find(g =>
        g.position.x <= pos.x && g.position.y <= pos.y &&
        g.position.x + g.scale.x >= pos.x && g.position.y + g.scale.y >= pos.y
    );
}

function saveLevel () {
    let levelString = levelToString();
    let name = prompt("Level Name:", "My Level");
    if (!name)
        return;
    editorLevel = {name: name, levelString};
    let data = JSON.stringify(editorLevel);
    let file = new Blob([data], {type: "txt"});
    let filename = name + ".jd";
    var a = document.createElement("a"),
            url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);  
    }, 0); 
}

function uploadLevel () {
    let input = document.createElement("input");
    input.type = "file";
    input.click();
    input.addEventListener('change', () => {
        var file = input.files[0];
        if (file) {
            var reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = function (evt) {
                editorLevel = JSON.parse(evt.target.result);
                parseBuild(editorLevel.levelString, editorLevel.name);
            }
            reader.onerror = function (evt) {
                console.log("error");
            }
        }
    });
}