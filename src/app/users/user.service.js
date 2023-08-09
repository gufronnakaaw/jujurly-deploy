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
exports.login = exports.register = void 0;
const validate_1 = __importDefault(require("../../utils/validate"));
const database_1 = __importDefault(require("../../utils/database"));
const ResponseError_1 = __importDefault(require("../../error/ResponseError"));
const user_validation_1 = require("./user.validation");
const password_1 = require("../../utils/password");
function register(body) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, fullname, password } = (0, validate_1.default)(user_validation_1.RegisterValidation, body);
        const user = yield database_1.default.user.findFirst({
            where: {
                email,
            },
        });
        if (user) {
            throw new ResponseError_1.default(400, 'Email already exists');
        }
        const data = {
            email,
            fullname,
            password: yield (0, password_1.hash)(password),
        };
        const create = yield database_1.default.user.create({
            data,
            select: {
                id: true,
            },
        });
        return {
            id: create.id,
            fullname,
        };
    });
}
exports.register = register;
function login(body) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = (0, validate_1.default)(user_validation_1.LoginValidation, body);
        const user = yield database_1.default.user.findFirst({
            where: {
                email,
            },
            select: {
                id: true,
                password: true,
                fullname: true,
            },
        });
        if (!user) {
            throw new ResponseError_1.default(400, 'Email or password wrong');
        }
        if (!(yield (0, password_1.verify)(password, user.password))) {
            throw new ResponseError_1.default(400, 'Email or password wrong');
        }
        return {
            id: user.id,
            fullname: user.fullname,
        };
    });
}
exports.login = login;
