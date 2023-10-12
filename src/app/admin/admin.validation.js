"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginAdminValidation = exports.deleteRoomsValidation = exports.deleteUsersValidation = void 0;
const zod_1 = require("zod");
const deleteUsersValidation = zod_1.z.object({
    user_id: zod_1.z.number().positive(),
});
exports.deleteUsersValidation = deleteUsersValidation;
const deleteRoomsValidation = zod_1.z.object({
    room_id: zod_1.z.number().positive(),
});
exports.deleteRoomsValidation = deleteRoomsValidation;
const loginAdminValidation = zod_1.z.object({
    username: zod_1.z.string().trim().nonempty(),
    password: zod_1.z.string().trim().nonempty(),
});
exports.loginAdminValidation = loginAdminValidation;
