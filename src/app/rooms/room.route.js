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
const AuthHandler_1 = __importDefault(require("../../handlers/AuthHandler"));
const room_service_1 = require("./room.service");
const room_schema_1 = require("./room.schema");
function routes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.addHook('onRequest', AuthHandler_1.default);
        fastify.post('/', (req, rep) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.user;
                const data = yield (0, room_service_1.create)(req.body, id);
                return rep.code(201).send({
                    success: true,
                    data,
                });
            }
            catch (error) {
                rep.send(error);
            }
        }));
        fastify.delete('/', (req, rep) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.user;
                yield (0, room_service_1.remove)(req.body, id);
                return rep.code(200).send({
                    success: true,
                    data: {
                        message: 'Delete room successfully',
                    },
                });
            }
            catch (error) {
                rep.send(error);
            }
        }));
        fastify.get('/', (req, rep) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id: userId } = req.user;
                const { id, code } = req.query;
                if (id) {
                    const response = rep.serializeInput({
                        success: true,
                        data: yield (0, room_service_1.getById)(Number(id), userId),
                    }, room_schema_1.getRoomsByIdSchema);
                    return rep
                        .code(200)
                        .header('content-type', 'application/json')
                        .send(response);
                }
                if (code) {
                    const response = rep.serializeInput({
                        success: true,
                        data: yield (0, room_service_1.getByCode)(code, userId),
                    }, room_schema_1.getRoomsByCodeSchema);
                    return rep
                        .code(200)
                        .header('content-type', 'application/json')
                        .send(response);
                }
                const response = rep.serializeInput({
                    success: true,
                    data: yield (0, room_service_1.getAll)(userId),
                }, room_schema_1.getAllSchema);
                return rep
                    .code(200)
                    .header('content-type', 'application/json')
                    .send(response);
            }
            catch (error) {
                rep.send(error);
            }
        }));
        fastify.post('/votes', (req, rep) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.user;
                yield (0, room_service_1.votes)(req.body, id);
                return rep.code(201).send({
                    success: true,
                    data: {
                        message: 'Vote candidate successfully',
                    },
                });
            }
            catch (error) {
                rep.send(error);
            }
        }));
        fastify.patch('/', (req, rep) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.user;
                const response = rep.serializeInput({
                    success: true,
                    data: yield (0, room_service_1.update)(req.body, id),
                }, room_schema_1.updateRoomsSchema);
                return rep
                    .code(200)
                    .header('content-type', 'application/json')
                    .send(response);
            }
            catch (error) {
                rep.send(error);
            }
        }));
    });
}
exports.default = routes;
