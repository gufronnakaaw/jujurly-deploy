"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoomsSchema = exports.getRoomsByIdSchema = exports.getRoomsByCodeSchema = exports.getAllSchema = void 0;
exports.getAllSchema = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        data: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'number' },
                    name: { type: 'string' },
                    start: { type: 'number' },
                    end: { type: 'number' },
                    code: { type: 'string' },
                },
            },
        },
    },
};
exports.getRoomsByCodeSchema = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        data: {
            type: 'object',
            properties: {
                id: { type: 'number' },
                name: { type: 'string' },
                start: { type: 'number' },
                end: { type: 'number' },
                code: { type: 'string' },
                total_votes: { type: 'number' },
                is_available: { type: 'boolean' },
                candidates: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'number' },
                            name: { type: 'string' },
                            percentage: { type: 'number' },
                            vote_count: { type: 'number' },
                        },
                    },
                },
            },
        },
    },
};
exports.getRoomsByIdSchema = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        data: {
            type: 'object',
            properties: {
                id: { type: 'number' },
                name: { type: 'string' },
                start: { type: 'number' },
                end: { type: 'number' },
                code: { type: 'string' },
                candidates: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'number' },
                            name: { type: 'string' },
                        },
                    },
                },
            },
        },
    },
};
exports.updateRoomsSchema = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        data: {
            type: 'object',
            properties: {
                id: { type: 'number' },
                name: { type: 'string' },
                start: { type: 'number' },
                end: { type: 'number' },
                code: { type: 'string' },
                candidates: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'number' },
                            name: { type: 'string' },
                        },
                    },
                },
            },
        },
    },
};
