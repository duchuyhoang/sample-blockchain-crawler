"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const enum_1 = require("../common/enum");
const utils_1 = require("../common/utils");
let QueueLog = class QueueLog {
    updateCreateDates() {
        this.createdAt = (0, utils_1.dateInMiliseconds)();
        this.updatedAt = (0, utils_1.dateInMiliseconds)();
        this.retryAt = (0, utils_1.dateInMiliseconds)();
    }
    updateUpdateDates() {
        this.updatedAt = (0, utils_1.dateInMiliseconds)();
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], QueueLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "text",
        name: "queue_name",
    }),
    __metadata("design:type", String)
], QueueLog.prototype, "queueName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "jsonb",
        name: "data",
        nullable: true,
    }),
    __metadata("design:type", Object)
], QueueLog.prototype, "data", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "text",
        name: "status",
        default: enum_1.QueueStatus.WAITING,
    }),
    __metadata("design:type", String)
], QueueLog.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "int",
        name: "try_num",
        default: 0,
    }),
    __metadata("design:type", Number)
], QueueLog.prototype, "tryNum", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "retry_at", type: "bigint", nullable: true }),
    __metadata("design:type", Object)
], QueueLog.prototype, "retryAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "created_at", type: "bigint" }),
    __metadata("design:type", Number)
], QueueLog.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "updated_at", type: "bigint" }),
    __metadata("design:type", Number)
], QueueLog.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QueueLog.prototype, "updateCreateDates", null);
__decorate([
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QueueLog.prototype, "updateUpdateDates", null);
QueueLog = __decorate([
    (0, typeorm_1.Entity)({
        name: "queue_logs",
    })
], QueueLog);
exports.default = QueueLog;
