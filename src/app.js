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
const dotenv_1 = require("dotenv");
const logger_1 = __importDefault(require("./utils/logger"));
const server_1 = __importDefault(require("./http/server"));
const database_1 = __importDefault(require("./utils/database"));
(0, dotenv_1.config)();
function app() {
    return __awaiter(this, void 0, void 0, function* () {
        const port = Number(process.env.PORT);
        const fastifyServer = (0, server_1.default)();
        try {
            yield database_1.default.$connect();
            yield fastifyServer.listen({ port });
            logger_1.default.info(`server is running at http://localhost:${port}`);
        }
        catch (error) {
            logger_1.default.error(error);
            process.exit(1);
        }
    });
}
app();
