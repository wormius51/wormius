

/**
 * Returns the matches of the expression in the string
 * @param {string} input 
 * @param {string} regexString A regular expression string
 */
 function matchesOfExpression (input, regexString) {
    const regex = new RegExp(regexString, "gm");
    const matches = input.match(regex);
    return matches;
}

/**
 * Replaces the "$x" expressions with the values
 * according to their order (0 is first)
 * @param {string} input 
 * @param {string[]} values 
 */
function injectStrings (input, values) {
    let output = input;
    output = output.replace("\\$", "󰂘");
    for (let i = 0; values[i]; i++) {
        output = output.replace(`$${i}`, values[i]);
    }
    output = output.replace("󰂘", "$");
    return output;
}

/**
 * Replaces the occorences of the regex in the input using the template.
 * @param {string} input The string to replace expressions in
 * @param {string} regexString The search string
 * @param {stirng} template A template of how to replace
 */
export function replaceTemplate (input, regexString, template) {
    let output = input;
    const matches = matchesOfExpression(input, regexString);
    if (!matches)
        return output;
    for (const match of matches) {
        const regex = new RegExp(regexString);
        const subMathches = regex.exec(match);
        const subOutput = injectStrings(template, subMathches);
        output = output.replace(match, subOutput);
    }
    return output;
}