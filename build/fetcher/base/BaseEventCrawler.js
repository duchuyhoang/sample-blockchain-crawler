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
const BaseIntervalWorker_1 = require("./BaseIntervalWorker");
const web3_1 = __importDefault(require("web3"));
const dataSource_1 = __importDefault(require("../../configs/dataSource"));
const CrawlProcess_1 = __importDefault(require("../../entities/CrawlProcess"));
const ethers_1 = require("ethers");
const constant_1 = require("../../common/constant");
class BaseEventCrawler extends BaseIntervalWorker_1.BaseIntervalWorker {
    constructor(options) {
        super();
        this.options = options;
        this.LATEST_BLOCK_FROM_NETWORK = NaN;
        this.LATEST_PROCESSED_BLOCK = NaN;
    }
    processBlock({ fromBlock, toBlock, latestNetworkBlock, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const web3 = new web3_1.default(this.getNetworkConfigs().rpcUrl);
            const contract = new web3.eth.Contract(this.getContractConfigs().contractAbi, this.getContractConfigs().contractAddress);
            console.log(`Begin process from ${fromBlock} to ${toBlock} / Latest network block: ${latestNetworkBlock}`);
            const eventLogs = yield contract.getPastEvents("allEvents", {
                fromBlock,
                toBlock,
            }, (err) => {
                !!err && console.log("Crawl event from sc:", err);
            });
            // console.log("total crawled data:", eventLogs);
            const formattedEventLogs = eventLogs;
            yield this.handleCrawledEvents(formattedEventLogs
                .sort((a, b) => a.blockNumber - b.blockNumber)
                .map((event) => ({
                event: event.event,
                data: event.returnValues,
                blockNumber: event.blockNumber,
            })));
        });
    }
    getNetworkConfigs() {
        this.getBlockData;
        return this.options.networkConfigs;
    }
    getContractConfigs() {
        return this.options.networkConfigs.contract;
    }
    getCurLatestProcessedBlock() {
        return parseInt(this.LATEST_PROCESSED_BLOCK.toString(), 10);
    }
    doProcess() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.crawlProcess) {
                console.log(`No crawling process found for : ${this.constructor.name}`);
                return;
            }
            const latestBlockFromNetwork = yield this.getNetworkLatestBlockNumber();
            this.LATEST_BLOCK_FROM_NETWORK = latestBlockFromNetwork;
            this.LATEST_PROCESSED_BLOCK = this.crawlProcess.lastProcessedBlock;
            let latestProcessedBlock = this.getCurLatestProcessedBlock();
            const fromBlockNumber = latestProcessedBlock === 0 ? 0 : latestProcessedBlock + 1;
            if (fromBlockNumber > latestBlockFromNetwork) {
                console.log(`Block ${fromBlockNumber} is the newest block`);
                return;
            }
            let toBlockNumber = fromBlockNumber + this.getNetworkConfigs().blockPerOneGo;
            if (toBlockNumber > latestBlockFromNetwork) {
                console.log("To block is higher");
                toBlockNumber = latestBlockFromNetwork;
            }
            console.log(`FROM ${fromBlockNumber} TO ${toBlockNumber} LATEST ${latestBlockFromNetwork}`);
            yield this.processBlock({
                fromBlock: fromBlockNumber,
                toBlock: toBlockNumber,
                latestNetworkBlock: latestBlockFromNetwork,
            });
            const crawlProcessRepository = dataSource_1.default.getRepository(CrawlProcess_1.default);
            this.crawlProcess.lastProcessedBlock = toBlockNumber;
            yield crawlProcessRepository.save(this.crawlProcess);
            this.LATEST_PROCESSED_BLOCK = toBlockNumber;
            // Have processed latest network block so set next tick time by average time
            if (fromBlockNumber === toBlockNumber) {
                this.setNextTickTime(this.getNetworkConfigs().averageBlockTime);
            }
            else {
                this.setNextTickTime(constant_1.DEFAULT_BREAK_TIME_AFTER_ONE_GO);
            }
        });
    }
    getBlockData(block_number) {
        return __awaiter(this, void 0, void 0, function* () {
            const web3 = new web3_1.default(this.getNetworkConfigs().rpcUrl);
            return web3.eth.getBlock(block_number);
        });
    }
    getTransactionData(block_number) {
        return __awaiter(this, void 0, void 0, function* () {
            const jsonProvider = new ethers_1.JsonRpcProvider(this.getNetworkConfigs().rpcUrl);
            const inter = new ethers_1.Interface(this.getContractConfigs().contractAbi);
            const blockData = yield this.getBlockData(block_number);
            const datas = yield Promise.all(blockData.transactions.map((transaction) => __awaiter(this, void 0, void 0, function* () {
                const tx = yield jsonProvider.getTransaction(transaction);
                if (tx === null || tx === void 0 ? void 0 : tx.data) {
                    const decodedOutput = inter.parseTransaction({
                        data: tx.data,
                        value: tx.value,
                    });
                    return decodedOutput;
                }
                return null;
            })));
            return datas.filter((data) => !!data);
        });
    }
    getNetworkLatestBlockNumber() {
        return __awaiter(this, void 0, void 0, function* () {
            const web3 = new web3_1.default(this.getNetworkConfigs().rpcUrl);
            const latestBlockFromNetwork = yield web3.eth.getBlockNumber();
            console.log("network", latestBlockFromNetwork, "real:", latestBlockFromNetwork - this.getNetworkConfigs().confirmationBlock);
            return latestBlockFromNetwork - this.getNetworkConfigs().confirmationBlock;
        });
    }
    prepare() {
        return __awaiter(this, void 0, void 0, function* () {
            const crawlProcessRepository = dataSource_1.default.getRepository(CrawlProcess_1.default);
            const latestBlockFromNetwork = yield this.getNetworkLatestBlockNumber();
            let crawlerProcess = yield crawlProcessRepository
                .createQueryBuilder("CrawlProcess")
                .where({
                contractAddress: this.getContractConfigs().contractAddress,
            })
                .andWhere({
                contractName: this.getContractConfigs().contractName,
            })
                .getOne();
            if (!crawlerProcess) {
                const newCrawlProcess = new CrawlProcess_1.default();
                newCrawlProcess.contractAddress =
                    this.getContractConfigs().contractAddress;
                newCrawlProcess.contractName = this.getContractConfigs().contractName;
                newCrawlProcess.lastProcessedBlock = this.getNetworkConfigs()
                    .latestFromNetwork
                    ? latestBlockFromNetwork === 0
                        ? 0
                        : latestBlockFromNetwork - 1
                    : (this.getNetworkConfigs().latestBlock || 0) - 1;
                try {
                    this.crawlProcess = yield crawlProcessRepository.save(newCrawlProcess);
                }
                catch (e) {
                    console.log(`Error while insert new crawling process: ${e.message}`);
                }
            }
            else {
                const crawlProcessRepository = dataSource_1.default.getRepository(CrawlProcess_1.default);
                crawlerProcess.lastProcessedBlock = this.getNetworkConfigs()
                    .latestFromNetwork
                    ? latestBlockFromNetwork === 0
                        ? 0
                        : latestBlockFromNetwork - 1
                    : (this.getNetworkConfigs().latestBlock || 0) - 1;
                yield crawlProcessRepository.save(crawlerProcess);
                this.crawlProcess = crawlerProcess;
            }
        });
    }
}
exports.default = BaseEventCrawler;
