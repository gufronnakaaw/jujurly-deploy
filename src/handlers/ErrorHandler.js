"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const ResponseError_1 = __importDefault(require("../error/ResponseError"));
function ErrorHandler(error, req, rep) {
    var _a;
    if (error instanceof ResponseError_1.default) {
        return rep.code(error.code).send({
            success: false,
            errors: [
                {
                    message: error.message,
                },
            ],
        });
    }
    if (error instanceof zod_1.ZodError) {
        const errors = error.issues.map((element) => {
            return {
                field: element.path[0],
                message: element.message,
            };
        });
        return rep.code(400).send({
            success: false,
            errors,
        });
    }
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        return rep.code(500).send({
            success: false,
            errors: [
                {
                    code: error.code,
                    field: (_a = error.meta) === null || _a === void 0 ? void 0 : _a.target,
                    message: error.message,
                },
            ],
        });
    }
    return rep.code(500).send({
        success: false,
        errors: [error],
    });
}
exports.default = ErrorHandler;
