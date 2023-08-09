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
(0, globals_1.describe)('POST /api/v1/users/register', () => {
    (0, globals_1.beforeAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, user_util_1.removeUsers)();
    }));
    (0, globals_1.afterAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, user_util_1.removeUsers)();
    }));
    (0, globals_1.it)('should can register users', () => __awaiter(void 0, void 0, void 0, function* () {
        const fastifyServer = (0, server_1.default)();
        const response = yield fastifyServer.inject({
            method: 'POST',
            url: '/api/v1/users/register',
            payload: {
                email: 'testing@mail.com',
                fullname: 'Testing',
                password: 'testing123',
            },
        });
        (0, globals_1.expect)(response.statusCode).toBe(201);
        (0, globals_1.expect)(response.json()).toHaveProperty('success');
        (0, globals_1.expect)(response.json()).toHaveProperty('data');
        (0, globals_1.expect)(response.json().success).toBeTruthy();
        (0, globals_1.expect)(response.json().data).toEqual(globals_1.expect.objectContaining({
            token: globals_1.expect.any(String),
        }));
    }));
    (0, globals_1.it)('should cannot register users if email is already exists', () => __awaiter(void 0, void 0, void 0, function* () {
        const fastifyServer = (0, server_1.default)();
        const response = yield fastifyServer.inject({
            method: 'POST',
            url: '/api/v1/users/register',
            payload: {
                email: 'testing@mail.com',
                fullname: 'Testing',
                password: 'testing123',
            },
        });
        (0, globals_1.expect)(response.statusCode).toBe(400);
        (0, globals_1.expect)(response.json()).toHaveProperty('success');
        (0, globals_1.expect)(response.json()).toHaveProperty('errors');
        (0, globals_1.expect)(response.json().success).toBeFalsy();
        (0, globals_1.expect)(response.json().errors).toBeDefined();
        (0, globals_1.expect)(response.json().errors).toEqual(globals_1.expect.arrayContaining([
            globals_1.expect.objectContaining({ message: globals_1.expect.any(String) }),
        ]));
    }));
    (0, globals_1.it)('should cannot register users if request is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const fastifyServer = (0, server_1.default)();
        const response = yield fastifyServer.inject({
            method: 'POST',
            url: '/api/v1/users/register',
            payload: {
                email: 'test@mail.com',
                fullname: '',
                password: '',
            },
        });
        (0, globals_1.expect)(response.statusCode).toBe(400);
        (0, globals_1.expect)(response.json()).toHaveProperty('success');
        (0, globals_1.expect)(response.json()).toHaveProperty('errors');
        (0, globals_1.expect)(response.json().success).toBeFalsy();
        (0, globals_1.expect)(response.json().errors).toBeDefined();
        (0, globals_1.expect)(response.json().errors).toEqual(globals_1.expect.arrayContaining([
            globals_1.expect.objectContaining({
                field: globals_1.expect.any(String),
                message: globals_1.expect.any(String),
            }),
        ]));
    }));
});
(0, globals_1.describe)('POST /api/v1/users/login', () => {
    (0, globals_1.beforeAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, user_util_1.createUsers)();
    }));
    (0, globals_1.afterAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, user_util_1.removeUsers)();
    }));
    (0, globals_1.it)('should can login users', () => __awaiter(void 0, void 0, void 0, function* () {
        const fastifyServer = (0, server_1.default)();
        const response = yield fastifyServer.inject({
            method: 'POST',
            url: '/api/v1/users/login',
            payload: {
                email: 'testing@mail.com',
                password: 'testing123',
            },
        });
        (0, globals_1.expect)(response.statusCode).toBe(200);
        (0, globals_1.expect)(response.json()).toHaveProperty('success');
        (0, globals_1.expect)(response.json()).toHaveProperty('data');
        (0, globals_1.expect)(response.json().success).toBeTruthy();
        (0, globals_1.expect)(response.json().data).toEqual(globals_1.expect.objectContaining({
            token: globals_1.expect.any(String),
        }));
    }));
    (0, globals_1.it)('should cannot login users (wrong email)', () => __awaiter(void 0, void 0, void 0, function* () {
        const fastifyServer = (0, server_1.default)();
        const response = yield fastifyServer.inject({
            method: 'POST',
            url: '/api/v1/users/login',
            payload: {
                email: 'wrong@mail.com',
                password: 'testing123',
            },
        });
        (0, globals_1.expect)(response.statusCode).toBe(400);
        (0, globals_1.expect)(response.json()).toHaveProperty('success');
        (0, globals_1.expect)(response.json()).toHaveProperty('errors');
        (0, globals_1.expect)(response.json().success).toBeFalsy();
        (0, globals_1.expect)(response.json().errors).toBeDefined();
        (0, globals_1.expect)(response.json().errors).toEqual(globals_1.expect.arrayContaining([
            globals_1.expect.objectContaining({ message: globals_1.expect.any(String) }),
        ]));
    }));
    (0, globals_1.it)('should cannot login users (wrong password)', () => __awaiter(void 0, void 0, void 0, function* () {
        const fastifyServer = (0, server_1.default)();
        const response = yield fastifyServer.inject({
            method: 'POST',
            url: '/api/v1/users/login',
            payload: {
                email: 'testing@mail.com',
                password: 'wrongpassword',
            },
        });
        (0, globals_1.expect)(response.statusCode).toBe(400);
        (0, globals_1.expect)(response.json()).toHaveProperty('success');
        (0, globals_1.expect)(response.json()).toHaveProperty('errors');
        (0, globals_1.expect)(response.json().success).toBeFalsy();
        (0, globals_1.expect)(response.json().errors).toBeDefined();
        (0, globals_1.expect)(response.json().errors).toEqual(globals_1.expect.arrayContaining([
            globals_1.expect.objectContaining({ message: globals_1.expect.any(String) }),
        ]));
    }));
    (0, globals_1.it)('should cannot login users if request is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const fastifyServer = (0, server_1.default)();
        const response = yield fastifyServer.inject({
            method: 'POST',
            url: '/api/v1/users/login',
            payload: {
                email: 'invalid request',
                password: 'ajshdjkashdjk',
            },
        });
        (0, globals_1.expect)(response.statusCode).toBe(400);
        (0, globals_1.expect)(response.json()).toHaveProperty('success');
        (0, globals_1.expect)(response.json()).toHaveProperty('errors');
        (0, globals_1.expect)(response.json().success).toBeFalsy();
        (0, globals_1.expect)(response.json().errors).toBeDefined();
        (0, globals_1.expect)(response.json().errors).toEqual(globals_1.expect.arrayContaining([
            globals_1.expect.objectContaining({
                field: globals_1.expect.any(String),
                message: globals_1.expect.any(String),
            }),
        ]));
    }));
});
