"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVotes = exports.deleteManyRooms = exports.createManyRooms = exports.createRooms = exports.deleteCandidates = exports.getRooms = exports.deleteRooms = void 0;
const database_1 = __importDefault(require("../../utils/database"));
const generate_1 = __importDefault(require("../../utils/generate"));
const user_util_1 = require("./user.util");
function deleteRooms() {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield (0, user_util_1.getUsers)();
        yield database_1.default.room.deleteMany({
            where: {
                user_id: user === null || user === void 0 ? void 0 : user.id,
            },
        });
    });
}
exports.deleteRooms = deleteRooms;
function getRooms() {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield (0, user_util_1.getUsers)();
        return database_1.default.room.findFirst({
            where: {
                user_id: user === null || user === void 0 ? void 0 : user.id,
            },
            include: {
                candidate: true,
            },
        });
    });
}
exports.getRooms = getRooms;
function deleteCandidates() {
    return __awaiter(this, void 0, void 0, function* () {
        const room = yield getRooms();
        if (room) {
            yield database_1.default.candidate.deleteMany({
                where: {
                    room_id: room === null || room === void 0 ? void 0 : room.id,
                },
            });
        }
    });
}
exports.deleteCandidates = deleteCandidates;
function createRooms() {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield (0, user_util_1.getUsers)();
        yield database_1.default.room.create({
            data: {
                name: 'Create Room Test',
                start: Date.now(),
                end: Date.now() + 7 * 24 * 60 * 60 * 1000,
                code: (0, generate_1.default)(8),
                user_id: user.id,
                candidate: {
                    createMany: {
                        data: [
                            {
                                name: 'Candidate Test 1',
                            },
                            {
                                name: 'Candidate Test 2',
                            },
                        ],
                    },
                },
            },
        });
    });
}
exports.createRooms = createRooms;
function createManyRooms() {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield (0, user_util_1.getUsers)();
        for (let i = 1; i <= 5; i++) {
            yield database_1.default.room.create({
                data: {
                    name: `Create Room Test ${i}`,
                    start: Date.now(),
                    end: Date.now() + 7 * 24 * 60 * 60 * 1000,
                    code: (0, generate_1.default)(8),
                    user_id: user.id,
                    candidate: {
                        createMany: {
                            data: [
                                {
                                    name: 'Candidate Test 1',
                                },
                                {
                                    name: 'Candidate Test 2',
                                },
                            ],
                        },
                    },
                },
            });
        }
    });
}
exports.createManyRooms = createManyRooms;
function deleteManyRooms() {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 1; i <= 5; i++) {
            const room = yield getRooms();
            yield deleteCandidates();
            yield database_1.default.room.deleteMany({
                where: {
                    id: room === null || room === void 0 ? void 0 : room.id,
                },
            });
        }
    });
}
exports.deleteManyRooms = deleteManyRooms;
function deleteVotes() {
    return __awaiter(this, void 0, void 0, function* () {
        const room = yield getRooms();
        const user = yield (0, user_util_1.getUsers)();
        yield database_1.default.vote.deleteMany({
            where: {
                AND: [
                    {
                        room_id: room.id,
                    },
                    {
                        user_id: user === null || user === void 0 ? void 0 : user.id,
                    },
                ],
            },
        });
    });
}
exports.deleteVotes = deleteVotes;
