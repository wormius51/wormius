
const main = document.getElementsByTagName('main')[0];
const postDiv = document.getElementById('postDiv');
const editorButtonsDiv = document.getElementById('editorButtons');

let selectedElement = undefined;
let selectionInputField = document.createElement('textarea');

window.addEventListener('load', () => {
    postDiv.innerHTML = decodeURI(postDiv.innerText);
    for (const element of postDiv.children) {
        element.addEventListener('click', () => {
            selectElement(element);
        });
    }
    postDiv.style.display = 'block';
    makeDropdown();
});

window.addEventListener('dblclick', deselectElement);

window.addEventListener('keydown', function(e) {
    if (e.key == 'Tab') {
        e.preventDefault();
        var start = selectionInputField.selectionStart;
        var end = selectionInputField.selectionEnd;
        selectionInputField.value = selectionInputField.value.substring(0, start) +
        "\t" + selectionInputField.value.substring(end);
        selectionInputField.selectionStart =
            selectionInputField.selectionEnd = start + 1;
    }
  });

window.addEventListener('load', () => {
    const editables = $('.editable');
    for (const element of editables) {
        element.addEventListener('click', () => {
            selectElement(element);
        });
    }
    setEditorButtons();
});

function selectElement (element) {
    deselectElement();
    selectionInputField.type = 'text';
    postDiv.replaceChild(selectionInputField, element);
    selectedElement = element;
    if (element.tagName == "PRE") {
        selectionInputField.value = element.children[0].children[0].innerHTML;
    } else {
        selectionInputField.value = element.innerHTML.replace(/<br>/g, '\n');
    }
}

function deselectElement () {
    if (!selectedElement)
        return;
    postDiv.replaceChild(selectedElement, selectionInputField);
    if (selectedElement.tagName == "PRE")
        selectedElement.children[0].children[0].innerHTML = selectionInputField.value;
    else
        selectedElement.innerHTML = selectionInputField.value.replace(/\n/g, '<br>');
    if (selectionInputField.value == "")
        postDiv.removeChild(selectedElement);
    selectedElement = undefined;
    makeDropdown();
}

function setEditorButtons () {
    const buttons = [
        EditorButton('h1', 'primaryText', 'Title'),
        EditorButton('h4', 'primaryText', 'Sub Title'),
        EditorButton('p', 'lead', 'Paragraph'),
        EditorButton('pre', ['lead', 'rounded'], 'Code')
    ];
    buttons.forEach(button => {
        editorButtonsDiv.appendChild(button);
    });
}

function EditorButton (tagName, className, text) {
    const button = document.createElement('button');
    button.innerHTML = text;
    button.addEventListener('click', () => {
        addElement(tagName, className);
    });
    return button;
}

function addElement (tagName, className) {
    const element = document.createElement(tagName);
    if (typeof className == 'string') {
        element.classList.add(className);
    } else {
        className.forEach(c => {
            element.classList.add(c);
        });
    }
    element.classList.add('editable');
    element.addEventListener('click', () => {
        selectElement(element);
    });
    postDiv.appendChild(element);
    if (element.tagName == "PRE") {
        const codeElement = document.createElement('code');
        const scriptElement = document.createElement('script');
        element.appendChild(codeElement);
        codeElement.appendChild(scriptElement);
        scriptElement.type = "text";
        scriptElement.classList.add('rounded');
    }
    selectElement(element);
}