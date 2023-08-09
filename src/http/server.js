"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const index_1 = __importDefault(require("./routes/index"));
function server() {
    const server = (0, fastify_1.default)();
    const secret = String(process.env.JWT_SECRET_KEY);
    server.register(cors_1.default, {
        origin: '*',
    });
    server.register(jwt_1.default, {
        secret,
        sign: {
            expiresIn: '1h',
        },
    });
    server.register(index_1.default, {
        prefix: 'api/v1',
    });
    return server;
}
exports.default = server;
