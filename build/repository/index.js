"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nftRepository = exports.queueLogRepository = exports.crawlProcessRepository = void 0;
const dataSource_1 = __importDefault(require("../configs/dataSource"));
const CrawlProcess_1 = __importDefault(require("../entities/CrawlProcess"));
const NFT_1 = __importDefault(require("../entities/NFT"));
const QueueLog_1 = __importDefault(require("../entities/QueueLog"));
// const repositoryManager = {
const crawlProcessRepository = dataSource_1.default.getRepository(CrawlProcess_1.default);
exports.crawlProcessRepository = crawlProcessRepository;
const nftRepository = dataSource_1.default.getRepository(NFT_1.default);
exports.nftRepository = nftRepository;
const queueLogRepository = dataSource_1.default.getRepository(QueueLog_1.default);
exports.queueLogRepository = queueLogRepository;
