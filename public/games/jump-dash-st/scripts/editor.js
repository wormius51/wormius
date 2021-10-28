
var editorMode = false;

var selectedObject = undefined;
var selectionOffset = undefined;
var selectionOriginalScale = undefined;

var editorLevel = undefined;

window.addEventListener('mousedown', editorMouseDown);
window.addEventListener('mouseup', editorMouseUp);
window.addEventListener('mousemove', editorMouseMove);
window.addEventListener('contextmenu', event => {if (editorMode) event.preventDefault()});

function editorClick (event) {
    if (!editorMode)
        return;
    let pos = screenToWorld(event.clientX, event.clientY);
    let g = lookForObject(pos);
    if (g) {
        if (editorControls.delete.pressed)
            g.destroy = true;
        else if (!editorControls.move.pressed && !editorControls.scale.pressed && event.which != 3) {
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
    editorClick(event);
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
    if (editorControls.move.pressed || event.which == 3) {
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

function activateEditorMode () {
    editorLevel = {
        name: "Editor",
        levelString: "t -214.4288745505968 -54.8012065929278 \"Editor Mode Activated!\" 71.33267209833794 t 582.1370167873237 -33.95953757225456 \"Hold DELETE and click to delete.\" 40.67041460796048 t 1402.7895932606357 -36.560693641618684 \"Hold M and drag to move.\" 39.00568846269506 t 1403.0353196714373 56.21387283236972 \"Hold S and drag to scale.\" 40.97597647766379 t 2030.477962933598 -88.58381621313092 \"Hold 0 to 9 and click to spawn.\" 38.60908451087218 t 2072.372621369813 -33.95953757225453 \"Ctrl + S to save. Ctrl + l to load.\" 30 p -106.4257503816277 150 b -300.86705202312123 200 3000 200 b -300.9407944307214 -99.95747771904745 50 350 b 2573.3316587444288 -114.61789822852782 126.31193406710418 404.6248925555333 b 1252.9301079112302 -77.3121387283239 120.3355386718265 264.16184971098266 b 1864.2638520857506 -74.56728640075417 134.10404624277476 261.5606936416185 "
    }
    editorMode = true;
    parseBuild(editorLevel.levelString, editorLevel.name);
    unpause();
}

async function readTextFile(file) {
    return new Promise((resolve, reject) => {
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", file, false);
        rawFile.onreadystatechange = function ()
        {
            if(rawFile.readyState === 4)
            {
                if(rawFile.status === 200 || rawFile.status == 0)
                {
                    var allText = rawFile.responseText;
                    resolve(allText);
                }
                reject(rawFile.responseText);
            }
        }
        rawFile.send(null);
    });
    
}