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
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = require("./user.service");
function routes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.post('/register', (req, rep) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield (0, user_service_1.register)(req.body);
                return rep.code(201).send({
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
        fastify.post('/login', (req, rep) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield (0, user_service_1.login)(req.body);
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
    });
}
exports.default = routes;
