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
const admin_service_1 = require("./admin.service");
const APITokenHandler_1 = __importDefault(require("../../handlers/APITokenHandler"));
function routes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.post('/login', (req, rep) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield (0, admin_service_1.login)(req.body, req.headers['user-agent']);
                return rep.code(200).send({
                    success: true,
                    data: {
                        token: yield rep.jwtSign(data),
                    },
                });
            }
            catch (error) {
                rep.send(error);
            }
        }));
        fastify.get('/dashboard', {
            preHandler: APITokenHandler_1.default,
        }, (req, rep) => __awaiter(this, void 0, void 0, function* () {
            try {
                const dashboard = yield (0, admin_service_1.getDashboard)();
                rep.code(200).send({
                    success: true,
                    data: dashboard,
                });
            }
            catch (error) {
                rep.send(error);
            }
        }));
        fastify.get('/users', {
            preHandler: APITokenHandler_1.default,
        }, (req, rep) => __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield (0, admin_service_1.getUsers)();
                rep.code(200).send({
                    success: true,
                    data: users,
                });
            }
            catch (error) {
                rep.send(error);
            }
        }));
        fastify.delete('/users', {
            preHandler: APITokenHandler_1.default,
        }, (req, rep) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { user_id } = req.body;
                yield (0, admin_service_1.removeUsers)(user_id);
                rep.code(200).send({
                    success: true,
                    message: 'delete user successfully',
                });
            }
            catch (error) {
                rep.send(error);
            }
        }));
        fastify.get('/rooms', {
            preHandler: APITokenHandler_1.default,
        }, (req, rep) => __awaiter(this, void 0, void 0, function* () {
            try {
                const rooms = yield (0, admin_service_1.getRooms)();
                rep.code(200).send({
                    success: true,
                    data: rooms,
                });
            }
            catch (error) {
                rep.send(error);
            }
        }));
        fastify.delete('/rooms', {
            preHandler: APITokenHandler_1.default,
        }, (req, rep) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { room_id } = req.body;
                yield (0, admin_service_1.removeRooms)(room_id);
                rep.code(200).send({
                    success: true,
                    message: 'delete rooms successfully',
                });
            }
            catch (error) {
                rep.send(error);
            }
        }));
        fastify.get('/logs', {
            preHandler: APITokenHandler_1.default,
        }, (req, rep) => __awaiter(this, void 0, void 0, function* () {
            try {
                const logs = yield (0, admin_service_1.getLogs)();
                rep.code(200).send({
                    success: true,
                    data: logs,
                });
            }
            catch (error) {
                rep.send(error);
            }
        }));
    });
}
exports.default = routes;
