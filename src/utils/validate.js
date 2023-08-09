"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function validate(schema, data) {
    return schema.parse(data);
}
exports.default = validate;
