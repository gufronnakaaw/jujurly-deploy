"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoomsValidation = exports.createVotesValidation = exports.getRoomsValidation = exports.deleteRoomsValidation = exports.createRoomsValidation = void 0;
const zod_1 = require("zod");
const createRoomsValidation = zod_1.z.object({
    name: zod_1.z.string().min(1),
    start: zod_1.z.number().positive(),
    end: zod_1.z.number().positive(),
    candidates: zod_1.z
        .array(zod_1.z.object({
        name: zod_1.z.string(),
    }))
        .min(2),
});
exports.createRoomsValidation = createRoomsValidation;
const deleteRoomsValidation = zod_1.z.object({
    room_id: zod_1.z.number().positive(),
    code: zod_1.z.string().min(8),
});
exports.deleteRoomsValidation = deleteRoomsValidation;
const getRoomsValidation = zod_1.z.object({
    id: zod_1.z.number().positive().optional(),
    code: zod_1.z.string().max(8).optional(),
});
exports.getRoomsValidation = getRoomsValidation;
const createVotesValidation = zod_1.z.object({
    room_id: zod_1.z.number().positive(),
    code: zod_1.z.string().min(8),
    candidate: zod_1.z.object({
        id: zod_1.z.number().positive(),
    }),
});
exports.createVotesValidation = createVotesValidation;
const updateRoomsValidation = zod_1.z.object({
    room_id: zod_1.z.number().positive(),
    name: zod_1.z.string().min(1).optional(),
    start: zod_1.z.number().positive().optional(),
    end: zod_1.z.number().positive().optional(),
    candidates: zod_1.z
        .array(zod_1.z.object({
        id: zod_1.z.number().positive(),
        name: zod_1.z.string(),
    }))
        .optional(),
});
exports.updateRoomsValidation = updateRoomsValidation;
