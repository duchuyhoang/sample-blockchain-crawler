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
const Processor_1 = __importDefault(require("./base/Processor"));
const constant_1 = require("../common/constant");
const lentRent_1 = __importDefault(require("../service/lentRent"));
const _1 = __importDefault(require("."));
const enum_1 = require("../common/enum");
class LendRentProcessor extends Processor_1.default {
    constructor() {
        super(constant_1.QUEUE_NAMES.LEND_RENT);
        this.lendRentService = new lentRent_1.default();
        this.setConcurrency(1);
    }
    handleUnfinishedOrFailedTask(manager, listTasks) {
        return __awaiter(this, void 0, void 0, function* () {
            listTasks.forEach((queueLog) => __awaiter(this, void 0, void 0, function* () {
                try {
                    this.queueInstance.add(queueLog, {
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
    prepare() {
        return __awaiter(this, void 0, void 0, function* () {
            this.queueInstance.process(this.getConcurrency() || 1, (job, done) => __awaiter(this, void 0, void 0, function* () {
                const { data } = job.data;
                const { event } = data;
                const lendRentService = new lentRent_1.default();
                try {
                    switch (event) {
                        case enum_1.CRAWL_EVENT.LENT:
                            const [rs, error] = yield lendRentService.handleLentEvent(job.data);
                            if (error) {
                                yield _1.default.handleFailedQueueLog(job.data);
                                done(error, null);
                            }
                            else {
                                done(null, rs);
                            }
                            break;
                        case enum_1.CRAWL_EVENT.RENT:
                            const [_rs, _error] = yield lendRentService.handleRentEvent(job.data);
                            if (_error) {
                                yield _1.default.handleFailedQueueLog(job.data);
                                done(_error, null);
                            }
                            else {
                                done(null, _rs);
                            }
                            break;
                        case enum_1.CRAWL_EVENT.STOP_LENDING:
                            const [stopLendingRs, stopLendingError] = yield lendRentService.handleStopLending(job.data);
                            if (stopLendingError) {
                                yield _1.default.handleFailedQueueLog(job.data);
                                done(stopLendingError, null);
                            }
                            else {
                                done(null, stopLendingRs);
                            }
                            break;
                        default:
                            done(null, { message: `Not exist event ${event}` });
                    }
                }
                catch (e) {
                    done(e, null);
                    yield _1.default.handleFailedQueueLog(job.data);
                }
            }));
        });
    }
}
exports.default = LendRentProcessor;
