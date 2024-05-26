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
const constant_1 = require("../common/constant");
const Processor_1 = __importDefault(require("./base/Processor"));
const moralis_1 = __importDefault(require("../service/moralis"));
const utils_1 = require("../common/utils");
const nft_1 = __importDefault(require("../service/nft"));
const _1 = __importDefault(require("."));
class NftCrawlerProcessor extends Processor_1.default {
    constructor() {
        super(constant_1.QUEUE_NAMES.NFT_QUEUE);
        this.setNextTickTime(10000);
        this.setConcurrency(1);
    }
    prepare() {
        return __awaiter(this, void 0, void 0, function* () {
            this.queueInstance.process(this.getConcurrency() || 2, (job, done) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { user_address, network } = job.data.data;
                    let moralisNfts = [];
                    const chain = (0, utils_1.getMoralisChain)(network);
                    const moralisService = new moralis_1.default();
                    const response = yield moralisService.getUserNft({
                        user_address,
                        chain: chain,
                    });
                    const nftService = new nft_1.default();
                    console.log("user:", user_address, "length:", response.result.length);
                    let cursor = response.pagination.cursor;
                    moralisNfts = [...response.result];
                    while (!!cursor) {
                        const loopResponse = yield moralisService.getUserNft({
                            user_address,
                            chain: chain,
                            cursor,
                        });
                        moralisNfts = moralisNfts.concat(loopResponse.result);
                        cursor = loopResponse.pagination.cursor;
                        // Avoid moralis break if request too much
                        yield (0, utils_1.sleep)(1000);
                    }
                    yield nftService.handleSaveNfts(response.result.map((rs) => (Object.assign(Object.assign({}, rs._data), { network }))));
                    done(null, `Succeed crawl user : ${user_address} nfts with no cursor`);
                }
                catch (e) {
                    console.log(e);
                    done(new Error(e));
                }
            }));
            this.queueInstance.on("failed", (job) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield _1.default.handleFailedQueueLog(job.data);
                }
                catch (e) { }
                // this.queueInstance;
            }));
        });
    }
    handleUnfinishedOrFailedTask(manager, listTasks) {
        return __awaiter(this, void 0, void 0, function* () {
            listTasks.forEach((queueLog) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const data = queueLog;
                    this.queueInstance.add(data, {
                        removeOnComplete: true,
                    });
                }
                catch (e) {
                    // Retry at 30s
                    yield _1.default.handleFailedQueueLog(queueLog);
                }
            }));
        });
    }
}
exports.default = NftCrawlerProcessor;
