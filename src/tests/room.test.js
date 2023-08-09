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
const globals_1 = require("@jest/globals");
const server_1 = __importDefault(require("../http/server"));
const user_util_1 = require("./utils/user.util");
const room_util_1 = require("./utils/room.util");
function doLogin() {
    return __awaiter(this, void 0, void 0, function* () {
        const fastifyServer = (0, server_1.default)();
        const response = yield fastifyServer.inject({
            method: 'POST',
            url: '/api/v1/users/login',
            payload: {
                email: 'testing@mail.com',
                password: 'testing123',
            },
        });
        return response.json().data.token;
    });
}
(0, globals_1.describe)('POST /api/v1/rooms', () => {
    (0, globals_1.beforeAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, user_util_1.createUsers)();
    }));
    (0, globals_1.afterAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, room_util_1.deleteCandidates)();
        yield (0, room_util_1.deleteRooms)();
        yield (0, user_util_1.removeUsers)();
    }));
    const payload = {
        name: 'Create Room Test',
        start: 1690776168631,
        end: 1690776168631,
        candidates: [
            {
                name: 'Candidate Test 1',
            },
            {
                name: 'Candidate Test 2',
            },
        ],
    };
    (0, globals_1.it)('should can create room', () => __awaiter(void 0, void 0, void 0, function* () {
        const fastifyServer = (0, server_1.default)();
        const token = yield doLogin();
        const response = yield fastifyServer.inject({
            method: 'POST',
            url: '/api/v1/rooms',
            headers: {
                authorization: `Bearer ${token}`,
            },
            payload,
        });
        (0, globals_1.expect)(response.statusCode).toBe(201);
        (0, globals_1.expect)(response.json()).toHaveProperty('success');
        (0, globals_1.expect)(response.json()).toHaveProperty('data');
        (0, globals_1.expect)(response.json().success).toBeTruthy();
        (0, globals_1.expect)(response.json().data).toEqual(globals_1.expect.objectContaining({
            id: globals_1.expect.any(Number),
            name: payload.name,
            start: payload.start,
            end: payload.end,
            code: globals_1.expect.any(String),
            candidates: payload.candidates,
        }));
    }));
    (0, globals_1.it)('should unauthorized', () => __awaiter(void 0, void 0, void 0, function* () {
        const fastifyServer = (0, server_1.default)();
        const response = yield fastifyServer.inject({
            method: 'POST',
            url: '/api/v1/rooms',
            payload,
        });
        (0, globals_1.expect)(response.statusCode).toBe(401);
        (0, globals_1.expect)(response.json()).toHaveProperty('success');
        (0, globals_1.expect)(response.json()).toHaveProperty('errors');
        (0, globals_1.expect)(response.json().success).toBeFalsy();
        (0, globals_1.expect)(response.json().errors).toEqual(globals_1.expect.arrayContaining([
            globals_1.expect.objectContaining({
                message: globals_1.expect.any(String),
            }),
        ]));
    }));
    (0, globals_1.it)('should cannot create rooms if request is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const fastifyServer = (0, server_1.default)();
        const token = yield doLogin();
        const response = yield fastifyServer.inject({
            method: 'POST',
            url: '/api/v1/rooms',
            headers: {
                authorization: `Bearer ${token}`,
            },
            payload: {
                name: 123,
                start: 1690776168631,
                end: 1690776168631,
                candidates: [
                    {
                        name: 'Candidate Test 1',
                    },
                ],
            },
        });
        (0, globals_1.expect)(response.statusCode).toBe(400);
        (0, globals_1.expect)(response.json()).toHaveProperty('success');
        (0, globals_1.expect)(response.json()).toHaveProperty('errors');
        (0, globals_1.expect)(response.json().success).toBeFalsy();
        (0, globals_1.expect)(response.json().errors).toEqual(globals_1.expect.arrayContaining([
            globals_1.expect.objectContaining({
                message: globals_1.expect.any(String),
            }),
        ]));
    }));
});
(0, globals_1.describe)('DELETE /api/v1/rooms', () => {
    (0, globals_1.beforeEach)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, user_util_1.createUsers)();
        yield (0, room_util_1.createRooms)();
    }));
    (0, globals_1.afterEach)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, room_util_1.deleteCandidates)();
        yield (0, room_util_1.deleteRooms)();
        yield (0, user_util_1.removeUsers)();
    }));
    (0, globals_1.it)('should can delete rooms', () => __awaiter(void 0, void 0, void 0, function* () {
        const fastifyServer = (0, server_1.default)();
        const room = yield (0, room_util_1.getRooms)();
        const token = yield doLogin();
        const response = yield fastifyServer.inject({
            method: 'DELETE',
            url: '/api/v1/rooms',
            headers: {
                authorization: `Bearer ${token}`,
            },
            payload: {
                room_id: room === null || room === void 0 ? void 0 : room.id,
                code: room === null || room === void 0 ? void 0 : room.code,
            },
        });
        (0, globals_1.expect)(response.statusCode).toBe(200);
        (0, globals_1.expect)(response.json()).toHaveProperty('success');
        (0, globals_1.expect)(response.json()).toHaveProperty('data');
        (0, globals_1.expect)(response.json().success).toBeTruthy();
        (0, globals_1.expect)(response.json().data).toEqual(globals_1.expect.objectContaining({
            message: globals_1.expect.any(String),
        }));
    }));
    (0, globals_1.it)('should cannot delete rooms if request is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const fastifyServer = (0, server_1.default)();
        const room = yield (0, room_util_1.getRooms)();
        const token = yield doLogin();
        const response = yield fastifyServer.inject({
            method: 'DELETE',
            url: '/api/v1/rooms',
            headers: {
                authorization: `Bearer ${token}`,
            },
            payload: {
                room_id: 'string',
                code: room === null || room === void 0 ? void 0 : room.code,
            },
        });
        (0, globals_1.expect)(response.statusCode).toBe(400);
        (0, globals_1.expect)(response.json()).toHaveProperty('success');
        (0, globals_1.expect)(response.json()).toHaveProperty('errors');
        (0, globals_1.expect)(response.json().success).toBeFalsy();
        (0, globals_1.expect)(response.json().errors).toEqual(globals_1.expect.arrayContaining([
            globals_1.expect.objectContaining({
                message: globals_1.expect.any(String),
            }),
        ]));
    }));
    (0, globals_1.it)('should cannot delete rooms if room id not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const fastifyServer = (0, server_1.default)();
        const room = yield (0, room_util_1.getRooms)();
        const token = yield doLogin();
        const response = yield fastifyServer.inject({
            method: 'DELETE',
            url: '/api/v1/rooms',
            headers: {
                authorization: `Bearer ${token}`,
            },
            payload: {
                room_id: 1,
                code: room === null || room === void 0 ? void 0 : room.code,
            },
        });
        (0, globals_1.expect)(response.statusCode).toBe(404);
        (0, globals_1.expect)(response.json()).toHaveProperty('success');
        (0, globals_1.expect)(response.json()).toHaveProperty('errors');
        (0, globals_1.expect)(response.json().success).toBeFalsy();
        (0, globals_1.expect)(response.json().errors).toEqual(globals_1.expect.arrayContaining([
            globals_1.expect.objectContaining({
                message: globals_1.expect.any(String),
            }),
        ]));
    }));
    (0, globals_1.it)('should cannot delete rooms if code not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const fastifyServer = (0, server_1.default)();
        const room = yield (0, room_util_1.getRooms)();
        const token = yield doLogin();
        const response = yield fastifyServer.inject({
            method: 'DELETE',
            url: '/api/v1/rooms',
            headers: {
                authorization: `Bearer ${token}`,
            },
            payload: {
                room_id: room === null || room === void 0 ? void 0 : room.id,
                code: 'WRONGGGG',
            },
        });
        (0, globals_1.expect)(response.statusCode).toBe(404);
        (0, globals_1.expect)(response.json()).toHaveProperty('success');
        (0, globals_1.expect)(response.json()).toHaveProperty('errors');
        (0, globals_1.expect)(response.json().success).toBeFalsy();
        (0, globals_1.expect)(response.json().errors).toEqual(globals_1.expect.arrayContaining([
            globals_1.expect.objectContaining({
                message: globals_1.expect.any(String),
            }),
        ]));
    }));
    (0, globals_1.it)('should unauthorized', () => __awaiter(void 0, void 0, void 0, function* () {
        const fastifyServer = (0, server_1.default)();
        const room = yield (0, room_util_1.getRooms)();
        const response = yield fastifyServer.inject({
            method: 'DELETE',
            url: '/api/v1/rooms',
            payload: {
                room_id: room === null || room === void 0 ? void 0 : room.id,
                code: room === null || room === void 0 ? void 0 : room.code,
            },
        });
        (0, globals_1.expect)(response.statusCode).toBe(401);
        (0, globals_1.expect)(response.json()).toHaveProperty('success');
        (0, globals_1.expect)(response.json()).toHaveProperty('errors');
        (0, globals_1.expect)(response.json().success).toBeFalsy();
        (0, globals_1.expect)(response.json().errors).toEqual(globals_1.expect.arrayContaining([
            globals_1.expect.objectContaining({
                message: globals_1.expect.any(String),
            }),
        ]));
    }));
});
(0, globals_1.describe)('GET /api/v1/rooms', () => {
    (0, globals_1.beforeAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, user_util_1.createUsers)();
        yield (0, room_util_1.createManyRooms)();
    }));
    (0, globals_1.afterAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, room_util_1.deleteManyRooms)();
        yield (0, user_util_1.removeUsers)();
    }));
    (0, globals_1.it)('should can get rooms', () => __awaiter(void 0, void 0, void 0, function* () {
        const fastifyServer = (0, server_1.default)();
        const token = yield doLogin();
        const response = yield fastifyServer.inject({
            method: 'GET',
            url: '/api/v1/rooms',
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
        (0, globals_1.expect)(response.statusCode).toBe(200);
        (0, globals_1.expect)(response.json()).toHaveProperty('success');
        (0, globals_1.expect)(response.json()).toHaveProperty('data');
        (0, globals_1.expect)(response.json().success).toBeTruthy();
        (0, globals_1.expect)(response.json().data.length).toBe(5);
        (0, globals_1.expect)(response.json().data).toEqual(globals_1.expect.arrayContaining([
            globals_1.expect.objectContaining({
                id: globals_1.expect.any(Number),
                name: globals_1.expect.any(String),
                start: globals_1.expect.any(Number),
                end: globals_1.expect.any(Number),
                code: globals_1.expect.any(String),
            }),
        ]));
    }));
    (0, globals_1.it)('should return empty array when the user has no rooms', () => __awaiter(void 0, void 0, void 0, function* () {
        const fastifyServer = (0, server_1.default)();
        const login = yield fastifyServer.inject({
            method: 'POST',
            url: '/api/v1/users/login',
            payload: {
                email: 'unittest@mail.com',
                password: 'unittest123',
            },
        });
        const response = yield fastifyServer.inject({
            method: 'GET',
            url: '/api/v1/rooms',
            headers: {
                authorization: `Bearer ${login.json().data.token}`,
            },
        });
        (0, globals_1.expect)(response.statusCode).toBe(200);
        (0, globals_1.expect)(response.json()).toHaveProperty('success');
        (0, globals_1.expect)(response.json()).toHaveProperty('data');
        (0, globals_1.expect)(response.json().success).toBeTruthy();
        (0, globals_1.expect)(response.json().data.length).toBe(0);
    }));
    (0, globals_1.it)('should unauthorized', () => __awaiter(void 0, void 0, void 0, function* () {
        const fastifyServer = (0, server_1.default)();
        const response = yield fastifyServer.inject({
            method: 'GET',
            url: '/api/v1/rooms',
        });
        (0, globals_1.expect)(response.statusCode).toBe(401);
        (0, globals_1.expect)(response.json()).toHaveProperty('success');
        (0, globals_1.expect)(response.json()).toHaveProperty('errors');
        (0, globals_1.expect)(response.json().success).toBeFalsy();
        (0, globals_1.expect)(response.json().errors).toEqual(globals_1.expect.arrayContaining([
            globals_1.expect.objectContaining({
                message: globals_1.expect.any(String),
            }),
        ]));
    }));
});
(0, globals_1.describe)('GET BY ID /api/v1/rooms', () => {
    (0, globals_1.beforeAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, user_util_1.createUsers)();
        yield (0, room_util_1.createRooms)();
    }));
    (0, globals_1.afterAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, room_util_1.deleteCandidates)();
        yield (0, room_util_1.deleteRooms)();
        yield (0, user_util_1.removeUsers)();
    }));
    (0, globals_1.it)('should can get rooms by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const fastifyServer = (0, server_1.default)();
        const token = yield doLogin();
        const room = yield (0, room_util_1.getRooms)();
        const response = yield fastifyServer.inject({
            method: 'GET',
            url: `/api/v1/rooms?id=${room === null || room === void 0 ? void 0 : room.id}`,
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
        (0, globals_1.expect)(response.statusCode).toBe(200);
        (0, globals_1.expect)(response.json()).toHaveProperty('success');
        (0, globals_1.expect)(response.json()).toHaveProperty('data');
        (0, globals_1.expect)(response.json().success).toBeTruthy();
        (0, globals_1.expect)(response.json().data).toEqual(globals_1.expect.objectContaining({
            id: globals_1.expect.any(Number),
            name: globals_1.expect.any(String),
            start: globals_1.expect.any(Number),
            end: globals_1.expect.any(Number),
            code: globals_1.expect.any(String),
            candidates: globals_1.expect.arrayContaining([
                globals_1.expect.objectContaining({
                    id: globals_1.expect.any(Number),
                    name: globals_1.expect.any(String),
                }),
            ]),
        }));
    }));
    (0, globals_1.it)('should cannot get rooms by id if room not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const fastifyServer = (0, server_1.default)();
        const token = yield doLogin();
        const room = yield (0, room_util_1.getRooms)();
        const response = yield fastifyServer.inject({
            method: 'GET',
            url: `/api/v1/rooms?id=${room.id + 1}`,
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
        (0, globals_1.expect)(response.statusCode).toBe(404);
        (0, globals_1.expect)(response.json()).toHaveProperty('success');
        (0, globals_1.expect)(response.json()).toHaveProperty('errors');
        (0, globals_1.expect)(response.json().success).toBeFalsy();
        (0, globals_1.expect)(response.json().errors).toEqual(globals_1.expect.arrayContaining([
            globals_1.expect.objectContaining({
                message: globals_1.expect.any(String),
            }),
        ]));
    }));
    (0, globals_1.it)('should unauthorized', () => __awaiter(void 0, void 0, void 0, function* () {
        const fastifyServer = (0, server_1.default)();
        const room = yield (0, room_util_1.getRooms)();
        const response = yield fastifyServer.inject({
            method: 'GET',
            url: `/api/v1/rooms?id=${room.id}`,
        });
        (0, globals_1.expect)(response.statusCode).toBe(401);
        (0, globals_1.expect)(response.json()).toHaveProperty('success');
        (0, globals_1.expect)(response.json()).toHaveProperty('errors');
        (0, globals_1.expect)(response.json().success).toBeFalsy();
        (0, globals_1.expect)(response.json().errors).toEqual(globals_1.expect.arrayContaining([
            globals_1.expect.objectContaining({
                message: globals_1.expect.any(String),
            }),
        ]));
    }));
    (0, globals_1.it)('should cannot get rooms by id if request invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const fastifyServer = (0, server_1.default)();
        const token = yield doLogin();
        const response = yield fastifyServer.inject({
            method: 'GET',
            url: `/api/v1/rooms?id=wrong`,
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
        (0, globals_1.expect)(response.statusCode).toBe(400);
        (0, globals_1.expect)(response.json()).toHaveProperty('success');
        (0, globals_1.expect)(response.json()).toHaveProperty('errors');
        (0, globals_1.expect)(response.json().success).toBeFalsy();
        (0, globals_1.expect)(response.json().errors).toEqual(globals_1.expect.arrayContaining([
            globals_1.expect.objectContaining({
                message: globals_1.expect.any(String),
            }),
        ]));
    }));
});
(0, globals_1.describe)('PATCH /api/v1/rooms', () => {
    (0, globals_1.beforeAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, user_util_1.createUsers)();
        yield (0, room_util_1.createRooms)();
    }));
    (0, globals_1.afterAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, room_util_1.deleteCandidates)();
        yield (0, room_util_1.deleteRooms)();
        yield (0, user_util_1.removeUsers)();
    }));
    (0, globals_1.it)('should can update rooms name', () => __awaiter(void 0, void 0, void 0, function* () {
        const fastifyServer = (0, server_1.default)();
        const token = yield doLogin();
        const room = yield (0, room_util_1.getRooms)();
        const payload = {
            room_id: room.id,
            name: 'Update Room Test',
        };
        const response = yield fastifyServer.inject({
            method: 'PATCH',
            url: `/api/v1/rooms`,
            headers: {
                authorization: `Bearer ${token}`,
            },
            payload,
        });
        (0, globals_1.expect)(response.statusCode).toBe(200);
        (0, globals_1.expect)(response.json()).toHaveProperty('success');
        (0, globals_1.expect)(response.json()).toHaveProperty('data');
        (0, globals_1.expect)(response.json().success).toBeTruthy();
        (0, globals_1.expect)(response.json().data).toEqual(globals_1.expect.objectContaining({
            id: globals_1.expect.any(Number),
            name: globals_1.expect.any(String),
            start: globals_1.expect.any(Number),
            end: globals_1.expect.any(Number),
            code: globals_1.expect.any(String),
            candidates: globals_1.expect.arrayContaining([
                globals_1.expect.objectContaining({
                    id: globals_1.expect.any(Number),
                    name: globals_1.expect.any(String),
                }),
            ]),
        }));
        (0, globals_1.expect)(response.json().data.name).not.toBe(room === null || room === void 0 ? void 0 : room.name);
    }));
    (0, globals_1.it)('should can update rooms candidates', () => __awaiter(void 0, void 0, void 0, function* () {
        const fastifyServer = (0, server_1.default)();
        const token = yield doLogin();
        const room = yield (0, room_util_1.getRooms)();
        const candidates = room === null || room === void 0 ? void 0 : room.candidate.map((element) => {
            return {
                id: element.id,
                name: `Update ${element.name}`,
            };
        });
        const payload = {
            room_id: room.id,
            candidates,
        };
        const response = yield fastifyServer.inject({
            method: 'PATCH',
            url: `/api/v1/rooms`,
            headers: {
                authorization: `Bearer ${token}`,
            },
            payload,
        });
        (0, globals_1.expect)(response.statusCode).toBe(200);
        (0, globals_1.expect)(response.json()).toHaveProperty('success');
        (0, globals_1.expect)(response.json()).toHaveProperty('data');
        (0, globals_1.expect)(response.json().success).toBeTruthy();
        (0, globals_1.expect)(response.json().data).toEqual(globals_1.expect.objectContaining({
            id: globals_1.expect.any(Number),
            name: globals_1.expect.any(String),
            start: globals_1.expect.any(Number),
            end: globals_1.expect.any(Number),
            code: globals_1.expect.any(String),
            candidates: globals_1.expect.arrayContaining([
                globals_1.expect.objectContaining({
                    id: globals_1.expect.any(Number),
                    name: globals_1.expect.any(String),
                }),
            ]),
        }));
        (0, globals_1.expect)(response.json().data.candidates).not.toEqual(room === null || room === void 0 ? void 0 : room.candidate);
    }));
    (0, globals_1.it)('should unauthorized', () => __awaiter(void 0, void 0, void 0, function* () {
        const fastifyServer = (0, server_1.default)();
        const response = yield fastifyServer.inject({
            method: 'PATCH',
            url: `/api/v1/rooms`,
        });
        (0, globals_1.expect)(response.statusCode).toBe(401);
        (0, globals_1.expect)(response.json()).toHaveProperty('success');
        (0, globals_1.expect)(response.json()).toHaveProperty('errors');
        (0, globals_1.expect)(response.json().success).toBeFalsy();
        (0, globals_1.expect)(response.json().errors).toEqual(globals_1.expect.arrayContaining([
            globals_1.expect.objectContaining({
                message: globals_1.expect.any(String),
            }),
        ]));
    }));
    (0, globals_1.it)('should cannot update rooms if request invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const fastifyServer = (0, server_1.default)();
        const token = yield doLogin();
        const response = yield fastifyServer.inject({
            method: 'PATCH',
            url: `/api/v1/rooms`,
            headers: {
                authorization: `Bearer ${token}`,
            },
            payload: {
                room_id: '12',
                name: 1234,
            },
        });
        (0, globals_1.expect)(response.statusCode).toBe(400);
        (0, globals_1.expect)(response.json()).toHaveProperty('success');
        (0, globals_1.expect)(response.json()).toHaveProperty('errors');
        (0, globals_1.expect)(response.json().success).toBeFalsy();
        (0, globals_1.expect)(response.json().errors).toEqual(globals_1.expect.arrayContaining([
            globals_1.expect.objectContaining({
                message: globals_1.expect.any(String),
            }),
        ]));
    }));
    (0, globals_1.it)('should cannot update rooms if room not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const fastifyServer = (0, server_1.default)();
        const token = yield doLogin();
        const room = yield (0, room_util_1.getRooms)();
        const response = yield fastifyServer.inject({
            method: 'PATCH',
            url: `/api/v1/rooms`,
            headers: {
                authorization: `Bearer ${token}`,
            },
            payload: {
                room_id: room.id + 1,
                name: 'Update Test',
            },
        });
        (0, globals_1.expect)(response.statusCode).toBe(404);
        (0, globals_1.expect)(response.json()).toHaveProperty('success');
        (0, globals_1.expect)(response.json()).toHaveProperty('errors');
        (0, globals_1.expect)(response.json().success).toBeFalsy();
        (0, globals_1.expect)(response.json().errors).toEqual(globals_1.expect.arrayContaining([
            globals_1.expect.objectContaining({
                message: globals_1.expect.any(String),
            }),
        ]));
    }));
});
(0, globals_1.describe)('POST /api/v1/rooms/votes', () => {
    (0, globals_1.beforeAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, user_util_1.createUsers)();
        yield (0, room_util_1.createRooms)();
    }));
    (0, globals_1.afterAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, room_util_1.deleteVotes)();
        yield (0, room_util_1.deleteCandidates)();
        yield (0, room_util_1.deleteRooms)();
        yield (0, user_util_1.removeUsers)();
    }));
    (0, globals_1.it)('should can votes', () => __awaiter(void 0, void 0, void 0, function* () {
        const fastifyServer = (0, server_1.default)();
        const token = yield doLogin();
        const room = yield (0, room_util_1.getRooms)();
        const payload = {
            room_id: room.id,
            code: room.code,
            candidate: {
                id: room.candidate[0].id,
            },
        };
        const response = yield fastifyServer.inject({
            method: 'POST',
            url: `/api/v1/rooms/votes`,
            headers: {
                authorization: `Bearer ${token}`,
            },
            payload,
        });
        (0, globals_1.expect)(response.statusCode).toBe(201);
        (0, globals_1.expect)(response.json()).toHaveProperty('success');
        (0, globals_1.expect)(response.json()).toHaveProperty('data');
        (0, globals_1.expect)(response.json().success).toBeTruthy();
        (0, globals_1.expect)(response.json().data).toEqual(globals_1.expect.objectContaining({
            message: globals_1.expect.any(String),
        }));
    }));
    (0, globals_1.it)('should cannot votes if user has already participated', () => __awaiter(void 0, void 0, void 0, function* () {
        const fastifyServer = (0, server_1.default)();
        const token = yield doLogin();
        const room = yield (0, room_util_1.getRooms)();
        const payload = {
            room_id: room.id,
            code: room.code,
            candidate: {
                id: room.candidate[0].id,
            },
        };
        const response = yield fastifyServer.inject({
            method: 'POST',
            url: `/api/v1/rooms/votes`,
            headers: {
                authorization: `Bearer ${token}`,
            },
            payload,
        });
        (0, globals_1.expect)(response.statusCode).toBe(409);
        (0, globals_1.expect)(response.json()).toHaveProperty('success');
        (0, globals_1.expect)(response.json()).toHaveProperty('errors');
        (0, globals_1.expect)(response.json().success).toBeFalsy();
        (0, globals_1.expect)(response.json().errors).toEqual(globals_1.expect.arrayContaining([
            globals_1.expect.objectContaining({
                message: globals_1.expect.any(String),
            }),
        ]));
    }));
    (0, globals_1.it)('should cannot votes if room not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const fastifyServer = (0, server_1.default)();
        const token = yield doLogin();
        const room = yield (0, room_util_1.getRooms)();
        const payload = {
            room_id: room.id + 1,
            code: room.code,
            candidate: {
                id: room.candidate[0].id,
            },
        };
        const response = yield fastifyServer.inject({
            method: 'POST',
            url: `/api/v1/rooms/votes`,
            headers: {
                authorization: `Bearer ${token}`,
            },
            payload,
        });
        (0, globals_1.expect)(response.statusCode).toBe(404);
        (0, globals_1.expect)(response.json()).toHaveProperty('success');
        (0, globals_1.expect)(response.json()).toHaveProperty('errors');
        (0, globals_1.expect)(response.json().success).toBeFalsy();
        (0, globals_1.expect)(response.json().errors).toEqual(globals_1.expect.arrayContaining([
            globals_1.expect.objectContaining({
                message: globals_1.expect.any(String),
            }),
        ]));
    }));
    (0, globals_1.it)('should cannot votes if candidate not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const fastifyServer = (0, server_1.default)();
        const token = yield doLogin();
        const room = yield (0, room_util_1.getRooms)();
        const payload = {
            room_id: room.id,
            code: room.code,
            candidate: {
                id: room.candidate[0].id + 999,
            },
        };
        const response = yield fastifyServer.inject({
            method: 'POST',
            url: `/api/v1/rooms/votes`,
            headers: {
                authorization: `Bearer ${token}`,
            },
            payload,
        });
        (0, globals_1.expect)(response.statusCode).toBe(404);
        (0, globals_1.expect)(response.json()).toHaveProperty('success');
        (0, globals_1.expect)(response.json()).toHaveProperty('errors');
        (0, globals_1.expect)(response.json().success).toBeFalsy();
        (0, globals_1.expect)(response.json().errors).toEqual(globals_1.expect.arrayContaining([
            globals_1.expect.objectContaining({
                message: globals_1.expect.any(String),
            }),
        ]));
    }));
    (0, globals_1.it)('should cannot votes if request invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const fastifyServer = (0, server_1.default)();
        const token = yield doLogin();
        const room = yield (0, room_util_1.getRooms)();
        const payload = {
            room_id: 'asdhjkashdjkasd',
            code: room.code,
        };
        const response = yield fastifyServer.inject({
            method: 'POST',
            url: `/api/v1/rooms/votes`,
            headers: {
                authorization: `Bearer ${token}`,
            },
            payload,
        });
        (0, globals_1.expect)(response.statusCode).toBe(400);
        (0, globals_1.expect)(response.json()).toHaveProperty('success');
        (0, globals_1.expect)(response.json()).toHaveProperty('errors');
        (0, globals_1.expect)(response.json().success).toBeFalsy();
        (0, globals_1.expect)(response.json().errors).toEqual(globals_1.expect.arrayContaining([
            globals_1.expect.objectContaining({
                message: globals_1.expect.any(String),
            }),
        ]));
    }));
    (0, globals_1.it)('should unauthorized', () => __awaiter(void 0, void 0, void 0, function* () {
        const fastifyServer = (0, server_1.default)();
        const room = yield (0, room_util_1.getRooms)();
        const payload = {
            room_id: room.id,
            code: room.code,
            candidate: {
                id: room.candidate[0].id,
            },
        };
        const response = yield fastifyServer.inject({
            method: 'POST',
            url: `/api/v1/rooms/votes`,
            payload,
        });
        (0, globals_1.expect)(response.statusCode).toBe(401);
        (0, globals_1.expect)(response.json()).toHaveProperty('success');
        (0, globals_1.expect)(response.json()).toHaveProperty('errors');
        (0, globals_1.expect)(response.json().success).toBeFalsy();
        (0, globals_1.expect)(response.json().errors).toEqual(globals_1.expect.arrayContaining([
            globals_1.expect.objectContaining({
                message: globals_1.expect.any(String),
            }),
        ]));
    }));
});
(0, globals_1.describe)('GET BY CODE /api/v1/rooms', () => {
    (0, globals_1.beforeAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, user_util_1.createUsers)();
        yield (0, room_util_1.createRooms)();
    }));
    (0, globals_1.afterAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, room_util_1.deleteVotes)();
        yield (0, room_util_1.deleteCandidates)();
        yield (0, room_util_1.deleteRooms)();
        yield (0, user_util_1.removeUsers)();
    }));
    (0, globals_1.it)('should can get rooms by code', () => __awaiter(void 0, void 0, void 0, function* () {
        const fastifyServer = (0, server_1.default)();
        const token = yield doLogin();
        const room = yield (0, room_util_1.getRooms)();
        const payload = {
            room_id: room.id,
            code: room.code,
            candidate: {
                id: room.candidate[0].id,
            },
        };
        yield fastifyServer.inject({
            method: 'POST',
            url: `/api/v1/rooms/votes`,
            headers: {
                authorization: `Bearer ${token}`,
            },
            payload,
        });
        const response = yield fastifyServer.inject({
            method: 'GET',
            url: `/api/v1/rooms?code=${room.code}`,
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
        (0, globals_1.expect)(response.statusCode).toBe(200);
        (0, globals_1.expect)(response.json()).toHaveProperty('success');
        (0, globals_1.expect)(response.json()).toHaveProperty('data');
        // logger.info(response.json());
        (0, globals_1.expect)(response.json().success).toBeTruthy();
        (0, globals_1.expect)(response.json().data).toEqual(globals_1.expect.objectContaining({
            id: globals_1.expect.any(Number),
            name: globals_1.expect.any(String),
            start: globals_1.expect.any(Number),
            end: globals_1.expect.any(Number),
            code: globals_1.expect.any(String),
            total_votes: globals_1.expect.any(Number),
            candidates: globals_1.expect.arrayContaining([
                globals_1.expect.objectContaining({
                    id: globals_1.expect.any(Number),
                    name: globals_1.expect.any(String),
                    percentage: globals_1.expect.any(Number),
                    vote_count: globals_1.expect.any(Number),
                }),
            ]),
        }));
        (0, globals_1.expect)(response.json().data.candidates[0].percentage).toBe(100);
    }));
    (0, globals_1.it)('should cannot get rooms if code not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const fastifyServer = (0, server_1.default)();
        const token = yield doLogin();
        const response = yield fastifyServer.inject({
            method: 'GET',
            url: `/api/v1/rooms?code=WRONGGGG`,
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
        (0, globals_1.expect)(response.statusCode).toBe(404);
        (0, globals_1.expect)(response.json()).toHaveProperty('success');
        (0, globals_1.expect)(response.json()).toHaveProperty('errors');
        (0, globals_1.expect)(response.json().success).toBeFalsy();
        (0, globals_1.expect)(response.json().errors).toEqual(globals_1.expect.arrayContaining([
            globals_1.expect.objectContaining({
                message: globals_1.expect.any(String),
            }),
        ]));
    }));
    (0, globals_1.it)('should cannot get rooms if voting has not started', () => __awaiter(void 0, void 0, void 0, function* () {
        const fastifyServer = (0, server_1.default)();
        const token = yield doLogin();
        const createRoom = yield fastifyServer.inject({
            method: 'POST',
            url: `/api/v1/rooms`,
            headers: {
                authorization: `Bearer ${token}`,
            },
            payload: {
                name: 'Create Room Test Again',
                start: Date.now() + 150000000,
                end: 1690776168631,
                candidates: [
                    {
                        name: 'Candidate Test 1',
                    },
                    {
                        name: 'Candidate Test 2',
                    },
                ],
            },
        });
        const response = yield fastifyServer.inject({
            method: 'GET',
            url: `/api/v1/rooms?code=${createRoom.json().data.code}`,
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
        (0, globals_1.expect)(response.statusCode).toBe(202);
        (0, globals_1.expect)(response.json()).toHaveProperty('success');
        (0, globals_1.expect)(response.json()).toHaveProperty('errors');
        (0, globals_1.expect)(response.json().success).toBeFalsy();
        (0, globals_1.expect)(response.json().errors).toEqual(globals_1.expect.arrayContaining([
            globals_1.expect.objectContaining({
                message: globals_1.expect.any(String),
            }),
        ]));
        yield fastifyServer.inject({
            method: 'DELETE',
            url: `/api/v1/rooms`,
            headers: {
                authorization: `Bearer ${token}`,
            },
            payload: {
                room_id: createRoom.json().data.id,
                code: createRoom.json().data.code,
            },
        });
    }));
    (0, globals_1.it)('should cannot get rooms if code invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const fastifyServer = (0, server_1.default)();
        const token = yield doLogin();
        const response = yield fastifyServer.inject({
            method: 'GET',
            url: `/api/v1/rooms?code=-aakjh0912`,
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
        (0, globals_1.expect)(response.statusCode).toBe(400);
        (0, globals_1.expect)(response.json()).toHaveProperty('success');
        (0, globals_1.expect)(response.json()).toHaveProperty('errors');
        (0, globals_1.expect)(response.json().success).toBeFalsy();
        (0, globals_1.expect)(response.json().errors).toEqual(globals_1.expect.arrayContaining([
            globals_1.expect.objectContaining({
                message: globals_1.expect.any(String),
            }),
        ]));
    }));
    (0, globals_1.it)('should unauthorized', () => __awaiter(void 0, void 0, void 0, function* () {
        const fastifyServer = (0, server_1.default)();
        const room = yield (0, room_util_1.getRooms)();
        const response = yield fastifyServer.inject({
            method: 'GET',
            url: `/api/v1/rooms?code=${room === null || room === void 0 ? void 0 : room.code}`,
        });
        (0, globals_1.expect)(response.statusCode).toBe(401);
        (0, globals_1.expect)(response.json()).toHaveProperty('success');
        (0, globals_1.expect)(response.json()).toHaveProperty('errors');
        (0, globals_1.expect)(response.json().success).toBeFalsy();
        (0, globals_1.expect)(response.json().errors).toEqual(globals_1.expect.arrayContaining([
            globals_1.expect.objectContaining({
                message: globals_1.expect.any(String),
            }),
        ]));
    }));
});
