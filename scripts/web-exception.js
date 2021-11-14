
class WebException {
    constructor (code = 500, message) {
        this.code = code;
        this.message = message;
    }
}

function catchWebException (res, exception) {
    res.send(err.message).status(err.code? err.code : 500);
}

module.exports.WebException = WebException;
module.exports.catchWebException = catchWebException;