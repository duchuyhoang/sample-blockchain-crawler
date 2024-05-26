"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bull_1 = __importDefault(require("bull"));
const constant_1 = require("../common/constant");
const redis_1 = require("../configs/redis");
const loanQueue = new bull_1.default(constant_1.QUEUE_NAMES.LOAN, redis_1.bullRedisOptions);
exports.default = loanQueue;
