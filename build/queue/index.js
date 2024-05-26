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
exports.queueManagement = void 0;
const enum_1 = require("../common/enum");
const repository_1 = require("../repository");
const utils_1 = require("../common/utils");
const QueueLog_1 = __importDefault(require("../entities/QueueLog"));
const dataSource_1 = __importDefault(require("../configs/dataSource"));
class QueueManagement {
    constructor() { }
    register(queueName, queueInstance) {
        queueInstance
            .on("completed", (job) => __awaiter(this, void 0, void 0, function* () {
            const { id } = job.data;
            try {
                yield this.updateStatus(id, enum_1.QueueStatus.COMPLETE);
            }
            catch (e) {
                console.log(`Failed to update status for ${job.name}`);
            }
        }))
            .on("failed", (job) => __awaiter(this, void 0, void 0, function* () {
            const { id } = job.data;
            try {
                console.log("fdffff");
                yield this.updateStatus(id, enum_1.QueueStatus.FAILED);
            }
            catch (e) {
                console.log(`Failed to update status for ${job.name}`);
            }
        }));
        QueueManagement.queueList.set(queueName, queueInstance);
    }
    static get(queueName) {
        return QueueManagement.queueList.get(queueName);
    }
    handleGetAllUnfinishedTask(queueName, limit) {
        return repository_1.queueLogRepository
            .createQueryBuilder("queue_logs")
            .orderBy("retry_at", "ASC")
            .where("queue_name = :queue_name AND try_num < 3 AND retry_at < :now AND status <> :status", {
            now: (0, utils_1.dateInMiliseconds)(),
            status: enum_1.QueueStatus.COMPLETE,
            queue_name: queueName,
        })
            .limit(limit)
            .getMany();
    }
    updateStatus(queueLogId, status) {
        repository_1.queueLogRepository
            .createQueryBuilder("queue_logs")
            .update(QueueLog_1.default)
            .set({
            status,
        })
            .where("id = :queue_log_id", {
            queue_log_id: queueLogId,
        })
            .execute();
    }
    insertQueueLog(queueName, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return dataSource_1.default.transaction((manager) => {
                const queueLog = new QueueLog_1.default();
                queueLog.status = enum_1.QueueStatus.WAITING;
                queueLog.queueName = queueName;
                queueLog.tryNum = 0;
                queueLog.retryAt = (0, utils_1.dateInMiliseconds)();
                queueLog.data = data;
                return manager
                    .createQueryBuilder()
                    .insert()
                    .into(QueueLog_1.default)
                    .values(queueLog)
                    .execute();
            });
        });
    }
    static handleFailedQueueLog(queueLog) {
        return __awaiter(this, void 0, void 0, function* () {
            return dataSource_1.default.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                if (queueLog.tryNum < 3) {
                    queueLog.retryAt =
                        parseInt((queueLog.retryAt || (0, utils_1.dateInMiliseconds)()).toString()) +
                            30000;
                    queueLog.tryNum = queueLog.tryNum + 1;
                    queueLog.status = enum_1.QueueStatus.FAILED;
                }
                else {
                    queueLog.retryAt = null;
                    queueLog.status = enum_1.QueueStatus.FAILED;
                }
                yield manager.getRepository(QueueLog_1.default).save(queueLog);
            }));
        });
    }
}
QueueManagement.queueList = new Map();
exports.queueManagement = new QueueManagement();
exports.default = QueueManagement;
