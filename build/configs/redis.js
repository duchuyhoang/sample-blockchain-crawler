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
exports.checkRedisReady = exports.bullRedisOptions = exports.redisConfigs = void 0;
const redis_1 = require("redis");
exports.redisConfigs = {};
exports.bullRedisOptions = {
    redis: {
        port: process.env.REDIS_PORT,
        host: process.env.REDIS_HOST,
        password: process.env.REDIS_PASSWORD,
    },
};
const checkRedisReady = () => new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
    const timeout = setTimeout(() => {
        reject("Redis connection timeout !!!");
    }, 5000);
    console.log(`redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);
    const client = (0, redis_1.createClient)({
        url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
        password: process.env.REDIS_PASSWORD,
    });
    try {
        yield client.connect();
        clearTimeout(timeout);
        resolve(true);
    }
    catch (e) {
        console.log("Redis is not running");
        clearTimeout(timeout);
        reject(e);
    }
}));
exports.checkRedisReady = checkRedisReady;
