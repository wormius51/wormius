import { replaceTemplate } from "./replacer.js";

const regexInput = document.getElementById('regexInput');
const templateInput = document.getElementById('templateInput');
const inputTextArea = document.getElementById('inputTextArea');
const outputTextArea = document.getElementById('outputTextArea');
const convertButton = document.getElementById('convertButton');


convertButton.addEventListener('click', () => {
    const output = replaceTemplate(
        inputTextArea.value,
        regexInput.value,
        templateInput.value
    );

    outputTextArea.value = output;
});