"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginValidation = exports.RegisterValidation = void 0;
const zod_1 = require("zod");
const RegisterValidation = zod_1.z.object({
    email: zod_1.z.string().email().min(1).max(255).trim(),
    fullname: zod_1.z.string().min(1).max(255).trim(),
    password: zod_1.z.string().min(1).max(255),
});
exports.RegisterValidation = RegisterValidation;
const LoginValidation = zod_1.z.object({
    email: zod_1.z.string().email().min(1).max(255).trim(),
    password: zod_1.z.string().min(1).max(255),
});
exports.LoginValidation = LoginValidation;
