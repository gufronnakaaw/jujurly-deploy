"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const logger_1 = __importDefault(require("./logger"));
const prisma = new client_1.PrismaClient({
    log: [
        {
            emit: 'event',
            level: 'error',
        },
        {
            emit: 'event',
            level: 'info',
        },
        {
            emit: 'event',
            level: 'warn',
        },
    ],
});
prisma.$on('error', (e) => {
    logger_1.default.error(e);
});
prisma.$on('warn', (e) => {
    logger_1.default.warn(e);
});
prisma.$on('info', ({ message, timestamp }) => {
    logger_1.default.info({
        message,
        timestamp,
    });
});
exports.default = prisma;
