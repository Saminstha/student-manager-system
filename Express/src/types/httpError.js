"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = exports.Conflict = exports.NotFound = exports.Forbidden = exports.Unauthorized = exports.BadRequest = exports.HttpError = void 0;
class HttpError extends Error {
    static statusCode = 500;
    status;
    constructor(status = HttpError.statusCode, message = "Internal Server Error") {
        super(message);
        this.name = new.target.name;
        this.status = status;
    }
}
exports.HttpError = HttpError;
class BadRequest extends HttpError {
    static statusCode = 400;
    constructor(message = "Bad Request") {
        super(BadRequest.statusCode, message);
    }
}
exports.BadRequest = BadRequest;
class Unauthorized extends HttpError {
    static statusCode = 401;
    constructor(message = "Unauthorized") {
        super(Unauthorized.statusCode, message);
    }
}
exports.Unauthorized = Unauthorized;
class Forbidden extends HttpError {
    static statusCode = 403;
    constructor(message = "Forbidden") {
        super(Forbidden.statusCode, message);
    }
}
exports.Forbidden = Forbidden;
class NotFound extends HttpError {
    static statusCode = 404;
    constructor(message = "Not Found") {
        super(NotFound.statusCode, message);
    }
}
exports.NotFound = NotFound;
class Conflict extends HttpError {
    static statusCode = 409;
    constructor(message = "Conflict") {
        super(Conflict.statusCode, message);
    }
}
exports.Conflict = Conflict;
class InternalServerError extends HttpError {
    static statusCode = 500;
    constructor(message = "Internal Server Error") {
        super(InternalServerError.statusCode, message);
    }
}
exports.InternalServerError = InternalServerError;
