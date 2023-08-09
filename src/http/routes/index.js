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
const ErrorHandler_1 = __importDefault(require("../../handlers/ErrorHandler"));
const user_route_1 = __importDefault(require("../../app/users/user.route"));
const room_route_1 = __importDefault(require("../../app/rooms/room.route"));
function routes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.register(user_route_1.default, { prefix: 'users' });
        fastify.register(room_route_1.default, { prefix: 'rooms' });
        fastify.setErrorHandler(ErrorHandler_1.default);
    });
}
exports.default = routes;
