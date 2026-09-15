"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
function validate(schemas) {
    return function (req, _res, next) {
        if (schemas.body) {
            req.body = schemas.body.parse(req.body);
        }
        if (schemas.params) {
            Object.assign(req.params, schemas.params.parse(req.params));
        }
        if (schemas.query) {
            Object.defineProperty(req, "query", {
                value: schemas.query.parse(req.query),
                writable: true,
                configurable: true,
            });
        }
        next();
    };
}
