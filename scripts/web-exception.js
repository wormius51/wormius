
class WebException {
    constructor (code = 500, message) {
        this.code = code;
        this.message = message;
    }
}

module.exports.WebException = WebException;