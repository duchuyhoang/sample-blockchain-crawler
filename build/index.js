"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const express_1 = __importDefault(require("express"));
require("reflect-metadata");
const dataSource_1 = __importDefault(require("./configs/dataSource"));
const moralis_1 = __importDefault(require("moralis"));
const enum_1 = require("./common/enum");
const redis_1 = require("./configs/redis");
const LentRentLauncher_1 = __importDefault(require("./launcher/LentRentLauncher"));
const NftCrawlerLauncher_1 = __importDefault(require("./launcher/NftCrawlerLauncher"));
const app = (0, express_1.default)();
const startApp = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, redis_1.checkRedisReady)();
        const initializedDatasource = yield dataSource_1.default.initialize();
        app.use((req, res, next) => {
            req.dataSource = initializedDatasource;
            next();
        });
        yield moralis_1.default.start({
            apiKey: process.env.MORALIS_KEY,
        });
        const nftCrawlerLauncher = new NftCrawlerLauncher_1.default({
            network: enum_1.NETWORK.ETH,
        });
        yield nftCrawlerLauncher.start();
        const lentRentLauncer = new LentRentLauncher_1.default({
            network: enum_1.NETWORK.ETH,
        });
        yield lentRentLauncer.start();
        console.log("Basic crawler running successfully!!!");
        return [true, null];
    }
    catch (e) {
        console.log(e);
        return [null, e];
    }
});
app.listen(3000, () => __awaiter(void 0, void 0, void 0, function* () {
    const [rs, err] = yield startApp();
    if (rs) {
        console.log("Server listen");
    }
    else {
        console.log("Server down");
    }
}));
