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
let ContractEvent = class ContractEvent {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], ContractEvent.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "text",
        nullable: false,
    }),
    __metadata("design:type", String)
], ContractEvent.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "text",
        name: "block_hash",
        nullable: false,
    }),
    __metadata("design:type", String)
], ContractEvent.prototype, "blockHash", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "bigint",
        name: "block_time",
        nullable: false,
    }),
    __metadata("design:type", Number)
], ContractEvent.prototype, "blockTime", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "text",
        name: "tx_hash",
        nullable: false,
    }),
    __metadata("design:type", String)
], ContractEvent.prototype, "txHash", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "bigint",
        name: "tx_index",
        nullable: false,
    }),
    __metadata("design:type", Number)
], ContractEvent.prototype, "txIndex", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "bigint",
        name: "event_id",
        nullable: false,
    }),
    __metadata("design:type", Number)
], ContractEvent.prototype, "eventId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "text",
        name: "event",
        nullable: false,
    }),
    __metadata("design:type", String)
], ContractEvent.prototype, "event", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "jsonb",
        name: "return_values",
    }),
    __metadata("design:type", Object)
], ContractEvent.prototype, "returnValues", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: "create_at",
    }),
    __metadata("design:type", Date)
], ContractEvent.prototype, "createAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: "update_at",
    }),
    __metadata("design:type", Date)
], ContractEvent.prototype, "updateAt", void 0);
ContractEvent = __decorate([
    (0, typeorm_1.Entity)({
        name: "contract_events",
    })
], ContractEvent);
exports.default = ContractEvent;
