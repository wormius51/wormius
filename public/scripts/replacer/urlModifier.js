
const andReplacement = "󰂘";

export function setQueryParam (key, value) {
    const params = getQueryParams();
    params[key] = value;
    changeUrl(params);
}

export function changeUrl (params) {
    let url = "?";

    for (const [key, value] of Object.entries(params)) {
        if (value)
            url += `${key}=${value.replaceAll('&', andReplacement)}&`;
    }

    url = url.substring(0, url.length - 1);

    window.history.pushState(params, "", url);
}


export function getQueryParams () {
    const url = window.location.href;
    const paramsString = url.split('?')[1];
    if (!paramsString)
        return {};
    
    const paramsStrings = paramsString.split('&');
    const params = {};

    for (const string of paramsStrings) {
        const keyAndValue = string.split('=');
        const key = keyAndValue[0];
        const value = keyAndValue[1];
        if (value)
            params[key] = decodeURI(value).replaceAll(andReplacement, "&");
    }

    return params;
}


window.changeUrl = changeUrl;
window.getQueryParams = getQueryParams;
window.setQueryParam = setQueryParam;