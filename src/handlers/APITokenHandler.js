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
const ResponseError_1 = __importDefault(require("../error/ResponseError"));
const database_1 = __importDefault(require("../utils/database"));
function APITokenHandler(req, rep, done) {
    return __awaiter(this, void 0, void 0, function* () {
        const { api_token } = req.headers;
        if (!api_token) {
            throw new ResponseError_1.default(401, 'Unauthorized');
        }
        const token = yield database_1.default.token.findFirst({
            where: {
                value: api_token,
            },
        });
        if (!token) {
            throw new ResponseError_1.default(401, 'Unauthorized');
        }
        if (Date.now() > token.expired) {
            throw new ResponseError_1.default(401, 'Unauthorized');
        }
        done();
    });
}
exports.default = APITokenHandler;
