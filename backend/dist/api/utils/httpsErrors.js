"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HTTPSClientError extends Error {
    constructor(message) {
        if (message instanceof Object) {
            super(JSON.stringify(message));
        }
        else {
            super(message);
        }
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.HTTPSClientError = HTTPSClientError;
class HTTPS400Error extends HTTPSClientError {
    constructor(message = 'Bad Request') {
        super(message);
        this.statusCode = 400;
    }
}
exports.HTTPS400Error = HTTPS400Error;
class HTTPS404Error extends HTTPSClientError {
    constructor(message = 'Not found') {
        super(message);
        this.statusCode = 404;
    }
}
exports.HTTPS404Error = HTTPS404Error;
