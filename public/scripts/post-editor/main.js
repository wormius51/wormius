
let selectedElement = undefined;
let selectionInputField = document.createElement('textarea');

window.addEventListener('dblclick', deselectElement);

window.addEventListener('load', () => {
    const editables = $('.editable');
    for (const element of editables) {
        element.addEventListener('click', () => {
            selectElement(element);
        });
    }
});

function selectElement (element) {
    deselectElement();
    const parent = element.parentNode;
    selectionInputField.type = 'text';
    parent.replaceChild(selectionInputField, element);
    selectedElement = element;
    selectionInputField.value = element.innerHTML;
}

function deselectElement () {
    if (!selectedElement)
        return;
    const parent = selectionInputField.parentNode;
    parent.replaceChild(selectedElement, selectionInputField);
    selectedElement.innerHTML = selectionInputField.value;
    selectedElement = undefined;
}