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
exports.update = exports.votes = exports.getById = exports.getByCode = exports.getAll = exports.remove = exports.create = void 0;
const ResponseError_1 = __importDefault(require("../../error/ResponseError"));
const database_1 = __importDefault(require("../../utils/database"));
const generate_1 = __importDefault(require("../../utils/generate"));
const validate_1 = __importDefault(require("../../utils/validate"));
const room_validation_1 = require("./room.validation");
function create(body, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, start, end, candidates } = (0, validate_1.default)(room_validation_1.createRoomsValidation, body);
        const room = {
            name,
            start,
            end,
            user_id: userId,
            code: (0, generate_1.default)(8),
        };
        const create = yield database_1.default.room.create({
            data: Object.assign(Object.assign({}, room), { candidate: {
                    createMany: {
                        data: candidates,
                    },
                } }),
            select: {
                id: true,
            },
        });
        return {
            id: create.id,
            name,
            start,
            end,
            code: room.code,
            candidates,
        };
    });
}
exports.create = create;
function remove(body, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const { room_id, code } = (0, validate_1.default)(room_validation_1.deleteRoomsValidation, body);
        const room = yield database_1.default.room.findFirst({
            where: {
                AND: [{ id: room_id }, { code }, { user_id: userId }],
            },
        });
        if (!room) {
            throw new ResponseError_1.default(404, 'Room not found');
        }
        yield database_1.default.$transaction([
            database_1.default.vote.deleteMany({
                where: {
                    room_id,
                },
            }),
            database_1.default.candidate.deleteMany({
                where: {
                    room_id,
                },
            }),
            database_1.default.room.deleteMany({
                where: {
                    AND: [
                        {
                            id: room_id,
                        },
                        {
                            code,
                        },
                        {
                            user_id: userId,
                        },
                    ],
                },
            }),
        ]);
    });
}
exports.remove = remove;
function getAll(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return database_1.default.room.findMany({
            where: {
                user_id: userId,
            },
            select: {
                id: true,
                name: true,
                start: true,
                end: true,
                code: true,
            },
            orderBy: {
                created_at: 'asc',
            },
        });
    });
}
exports.getAll = getAll;
function getByCode(code, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const valid = (0, validate_1.default)(room_validation_1.getRoomsValidation, { code });
        const room = yield database_1.default.room.findFirst({
            where: {
                code: valid.code,
            },
            select: {
                id: true,
                name: true,
                start: true,
                end: true,
                code: true,
            },
        });
        if (!room) {
            throw new ResponseError_1.default(404, 'Room not found');
        }
        const [votes, total_votes, is_available] = yield database_1.default.$transaction([
            database_1.default.$queryRaw `SELECT c.id, c.name, COUNT(v.id) AS vote_count,
    (ROUND(COUNT(v.id) * 100 / NULLIF((SELECT COUNT(id) FROM votes WHERE room_id = ${room.id}), 0), 2)) as percentage
        FROM candidates c
        LEFT JOIN votes v ON c.id = v.candidate_id
      WHERE c.room_id = ${room.id}
    GROUP BY c.id, c.name 
    ORDER BY c.id ASC;`,
            database_1.default.vote.count({
                where: {
                    room_id: room.id,
                },
            }),
            database_1.default.vote.count({
                where: {
                    AND: [
                        {
                            room_id: room.id,
                        },
                        {
                            user_id: userId,
                        },
                    ],
                },
            }),
        ]);
        const candidates = votes.map(({ id, name, vote_count, percentage }) => {
            return {
                id,
                name,
                percentage: !percentage ? 0 : percentage,
                vote_count: Number(vote_count),
            };
        });
        return Object.assign(Object.assign({}, room), { total_votes, is_available: Boolean(!is_available), candidates });
    });
}
exports.getByCode = getByCode;
function getById(id, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const valid = (0, validate_1.default)(room_validation_1.getRoomsValidation, { id });
        const room = yield database_1.default.room.findFirst({
            where: {
                AND: [
                    {
                        id: valid.id,
                    },
                    {
                        user_id: userId,
                    },
                ],
            },
            select: {
                id: true,
                name: true,
                start: true,
                end: true,
                code: true,
                candidate: {
                    select: {
                        id: true,
                        name: true,
                    },
                    where: {
                        room_id: valid.id,
                    },
                },
            },
        });
        if (!room) {
            throw new ResponseError_1.default(404, 'Room not found');
        }
        return Object.assign(Object.assign({}, room), { candidates: room.candidate });
    });
}
exports.getById = getById;
function votes(body, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const valid = (0, validate_1.default)(room_validation_1.createVotesValidation, body);
        const room = yield database_1.default.room.findFirst({
            where: {
                AND: [
                    {
                        id: valid.room_id,
                    },
                    {
                        code: valid.code,
                    },
                ],
            },
        });
        if (!room) {
            throw new ResponseError_1.default(404, 'Room not found');
        }
        const candidate = yield database_1.default.candidate.count({
            where: {
                AND: [
                    {
                        id: valid.candidate.id,
                    },
                    {
                        room_id: valid.room_id,
                    },
                ],
            },
        });
        if (!candidate) {
            throw new ResponseError_1.default(404, 'Candidate not found');
        }
        if (Date.now() > room.end) {
            throw new ResponseError_1.default(202, 'Voting has ended');
        }
        const votes = yield database_1.default.vote.count({
            where: {
                AND: [
                    {
                        room_id: valid.room_id,
                    },
                    {
                        user_id: userId,
                    },
                ],
            },
        });
        if (votes > 0) {
            throw new ResponseError_1.default(409, 'You have already participated');
        }
        yield database_1.default.vote.create({
            data: {
                user_id: userId,
                room_id: valid.room_id,
                candidate_id: valid.candidate.id,
            },
        });
    });
}
exports.votes = votes;
function update(body, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const { room_id, name, start, end, candidates } = (0, validate_1.default)(room_validation_1.updateRoomsValidation, body);
        const room = yield database_1.default.room.findFirst({
            where: {
                AND: [
                    {
                        id: room_id,
                    },
                    {
                        user_id: userId,
                    },
                ],
            },
        });
        if (!room) {
            throw new ResponseError_1.default(404, 'Room not found');
        }
        yield database_1.default.room.update({
            where: {
                id: room_id,
            },
            data: {
                name,
                start,
                end,
            },
        });
        if (candidates) {
            yield database_1.default.room.update({
                where: {
                    id: room_id,
                },
                data: {
                    candidate: {
                        deleteMany: {
                            NOT: candidates.map((candidate) => {
                                return {
                                    id: candidate.id,
                                };
                            }),
                        },
                        upsert: candidates.map((candidate) => {
                            return {
                                where: {
                                    id: candidate.id,
                                },
                                update: {
                                    name: candidate.name,
                                },
                                create: {
                                    name: candidate.name,
                                },
                            };
                        }),
                    },
                },
            });
        }
        const update = yield database_1.default.room.findFirst({
            where: {
                id: room_id,
            },
            select: {
                id: true,
                name: true,
                start: true,
                end: true,
                code: true,
                candidate: {
                    select: {
                        id: true,
                        name: true,
                    },
                    where: {
                        room_id,
                    },
                },
            },
        });
        return Object.assign(Object.assign({}, update), { candidates: update.candidate });
    });
}
exports.update = update;
