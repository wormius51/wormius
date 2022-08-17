import { replaceTemplate } from "./replacer.js";
import { getQueryParams, setQueryParam } from "./urlModifier.js";

const regexInput = document.getElementById('regexInput');
const templateInput = document.getElementById('templateInput');
const inputTextArea = document.getElementById('inputTextArea');
const outputTextArea = document.getElementById('outputTextArea');
const convertButton = document.getElementById('convertButton');

const QUERY_PARAMS = {
    regex: "regex",
    template: "template",
    input: "input"
};

convertButton.addEventListener('click', () => {
    const output = replaceTemplate(
        inputTextArea.value,
        regexInput.value,
        templateInput.value
    );

    outputTextArea.value = output;
});


regexInput.addEventListener('change', () => {
    setQueryParam(QUERY_PARAMS.regex, regexInput.value);
});
regexInput.addEventListener('keyup', () => {
    setQueryParam(QUERY_PARAMS.regex, regexInput.value);
});

templateInput.addEventListener('change', () => {
    setQueryParam(QUERY_PARAMS.template, templateInput.value);
});
templateInput.addEventListener('keyup', () => {
    setQueryParam(QUERY_PARAMS.template, templateInput.value);
});


window.addEventListener('load', () => {
    const params = getQueryParams();
    if (params[QUERY_PARAMS.regex])
        regexInput.value = params[QUERY_PARAMS.regex];
    if (params[QUERY_PARAMS.template])
        templateInput.value = params[QUERY_PARAMS.template];
    if (params[QUERY_PARAMS.input])
        inputTextArea.value = params[QUERY_PARAMS.input];
});