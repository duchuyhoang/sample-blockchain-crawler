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
const __1 = __importDefault(require(".."));
const enum_1 = require("../../common/enum");
const utils_1 = require("../../common/utils");
const dataSource_1 = __importDefault(require("../../configs/dataSource"));
const QueueLog_1 = __importDefault(require("../../entities/QueueLog"));
const BaseIntervalWorker_1 = require("../../fetcher/base/BaseIntervalWorker");
class Processor extends BaseIntervalWorker_1.BaseIntervalWorker {
    constructor(queueName) {
        super();
        this.queueName = queueName;
        this.concurrency = 1;
        this.queueInstance = __1.default.get(this.queueName);
    }
    setConcurrency(value) {
        this.concurrency = value;
    }
    getConcurrency() {
        return this.concurrency;
    }
    doProcess() {
        return __awaiter(this, void 0, void 0, function* () {
            dataSource_1.default.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const listQueueLogs = yield manager
                    .getRepository(QueueLog_1.default)
                    .createQueryBuilder("queue_logs")
                    .orderBy("retry_at", "ASC")
                    .where("queue_name = :queue_name AND try_num < 3 AND retry_at < :now AND retry_at IS NOT NULL AND status <> :status", {
                    now: (0, utils_1.dateInMiliseconds)(),
                    status: enum_1.QueueStatus.COMPLETE,
                    queue_name: this.queueName,
                })
                    .take(this.getConcurrency())
                    .getMany();
                // console.log("total task", listQueueLogs.length);
                yield this.handleUnfinishedOrFailedTask(manager, listQueueLogs);
            }));
        });
    }
}
exports.default = Processor;
