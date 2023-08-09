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
exports.getUsers = exports.createUsers = exports.removeUsers = void 0;
const database_1 = __importDefault(require("../../utils/database"));
const password_1 = require("../../utils/password");
function removeUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_1.default.user.deleteMany({
            where: {
                email: 'testing@mail.com',
            },
        });
    });
}
exports.removeUsers = removeUsers;
function createUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_1.default.user.create({
            data: {
                email: 'testing@mail.com',
                fullname: 'Testing',
                password: yield (0, password_1.hash)('testing123'),
            },
        });
    });
}
exports.createUsers = createUsers;
function getUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        return database_1.default.user.findFirst({
            where: {
                email: 'testing@mail.com',
            },
        });
    });
}
exports.getUsers = getUsers;
