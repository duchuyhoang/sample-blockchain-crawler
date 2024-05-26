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
const BaseEventCrawler_1 = __importDefault(require("./base/BaseEventCrawler"));
const queue_1 = require("../queue");
const constant_1 = require("../common/constant");
const lentRent_queue_1 = __importDefault(require("../queue/lentRent.queue"));
class LendRentCrawler extends BaseEventCrawler_1.default {
    constructor(options) {
        super(options);
        this.options = options;
        queue_1.queueManagement.register(constant_1.QUEUE_NAMES.LEND_RENT, lentRent_queue_1.default);
        this.setNextTickTime(this.options.networkConfigs.averageBlockTime);
        this.setProcessingTimeout(10000);
    }
    handleCrawledEvents(datas) {
        return __awaiter(this, void 0, void 0, function* () {
            datas.forEach((data) => __awaiter(this, void 0, void 0, function* () {
                yield queue_1.queueManagement.insertQueueLog(constant_1.QUEUE_NAMES.LEND_RENT, Object.assign(Object.assign({}, data.data), { event: data.event, network: this.options.networkConfigs.network }));
            }));
        });
    }
}
exports.default = LendRentCrawler;
