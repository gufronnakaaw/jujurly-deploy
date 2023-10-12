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
exports.login = exports.removeRooms = exports.removeUsers = exports.getLogs = exports.getRooms = exports.getUsers = exports.getDashboard = void 0;
const crypto_1 = __importDefault(require("crypto"));
const ua_parser_js_1 = __importDefault(require("ua-parser-js"));
const ResponseError_1 = __importDefault(require("../../error/ResponseError"));
const database_1 = __importDefault(require("../../utils/database"));
const validate_1 = __importDefault(require("../../utils/validate"));
const admin_validation_1 = require("./admin.validation");
const password_1 = require("../../utils/password");
function getDashboard() {
    return __awaiter(this, void 0, void 0, function* () {
        const [total_users, total_rooms, total_candidates] = yield database_1.default.$transaction([
            database_1.default.user.count(),
            database_1.default.room.count(),
            database_1.default.candidate.count(),
        ]);
        return {
            total_users,
            total_rooms,
            total_candidates,
        };
    });
}
exports.getDashboard = getDashboard;
function getUsers() {
    return database_1.default.user.findMany({
        select: {
            id: true,
            fullname: true,
            email: true,
            created_at: true,
        },
        orderBy: {
            created_at: 'desc',
        },
    });
}
exports.getUsers = getUsers;
function getRooms() {
    return __awaiter(this, void 0, void 0, function* () {
        const rooms = yield database_1.default.room.findMany({
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
                },
                user: {
                    select: {
                        fullname: true,
                    },
                },
                created_at: true,
            },
            orderBy: {
                created_at: 'desc',
            },
        });
        const data = rooms.map((room) => {
            room.owner = room.user.fullname;
            room.candidates = room.candidate;
            delete room.user;
            delete room.candidate;
            return Object.assign(Object.assign({}, room), { start: Number(room.start), end: Number(room.end) });
        });
        return data;
    });
}
exports.getRooms = getRooms;
function getLogs() {
    return database_1.default.log.findMany({
        select: {
            log_id: true,
            name: true,
            device: true,
            created_at: true,
        },
        orderBy: {
            created_at: 'desc',
        },
    });
}
exports.getLogs = getLogs;
function removeUsers(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const { user_id } = (0, validate_1.default)(admin_validation_1.deleteUsersValidation, { user_id: userId });
        const user = yield database_1.default.user.count({
            where: {
                id: user_id,
            },
        });
        if (user < 1) {
            throw new ResponseError_1.default(404, 'user not found');
        }
        const rooms = yield database_1.default.room.findMany({
            where: {
                user_id,
            },
        });
        yield Promise.all(rooms.map((room) => __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.$transaction([
                database_1.default.vote.deleteMany({
                    where: {
                        room_id: room.id,
                    },
                }),
                database_1.default.candidate.deleteMany({
                    where: {
                        room_id: room.id,
                    },
                }),
            ]);
        })));
        yield database_1.default.$transaction([
            database_1.default.vote.deleteMany({
                where: {
                    user_id,
                },
            }),
            database_1.default.room.deleteMany({
                where: {
                    user_id,
                },
            }),
            database_1.default.user.deleteMany({
                where: {
                    id: user_id,
                },
            }),
        ]);
    });
}
exports.removeUsers = removeUsers;
function removeRooms(roomId) {
    return __awaiter(this, void 0, void 0, function* () {
        const { room_id } = (0, validate_1.default)(admin_validation_1.deleteRoomsValidation, { room_id: roomId });
        const room = yield database_1.default.room.findFirst({
            where: {
                id: room_id,
            },
        });
        if (!room) {
            throw new ResponseError_1.default(404, 'room not found');
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
                    id: room_id,
                },
            }),
        ]);
    });
}
exports.removeRooms = removeRooms;
function login(body, userAgent) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password } = (0, validate_1.default)(admin_validation_1.loginAdminValidation, body);
        const admin = yield database_1.default.admin.findFirst({
            where: {
                username,
            },
        });
        if (!admin) {
            throw new ResponseError_1.default(400, 'username or password wrong');
        }
        if (!(yield (0, password_1.verify)(password, admin.password))) {
            throw new ResponseError_1.default(400, 'username or password wrong');
        }
        const parser = new ua_parser_js_1.default(userAgent);
        const device = parser.getOS().name
            ? `${parser.getOS().name} ${parser.getOS().version}`
            : 'unknown';
        const api_token = crypto_1.default.randomUUID().replace(/-/g, '');
        yield database_1.default.$transaction([
            database_1.default.token.create({
                data: {
                    value: api_token,
                    expired: Date.now() + 1000 * 60 * 60,
                },
            }),
            database_1.default.log.create({
                data: {
                    device,
                    name: admin.fullname,
                    log_id: crypto_1.default.randomUUID().replace(/-/g, '').slice(0, 10),
                },
            }),
        ]);
        return {
            email: admin.email,
            fullname: admin.fullname,
            api_token,
        };
    });
}
exports.login = login;
