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
let CrawlProcess = class CrawlProcess {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], CrawlProcess.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "contract_name",
        type: "text",
        unique: true,
    }),
    __metadata("design:type", String)
], CrawlProcess.prototype, "contractName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "contract_address",
        type: "text",
        unique: true,
        nullable: false,
    }),
    __metadata("design:type", String)
], CrawlProcess.prototype, "contractAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "last_processed_block",
        type: "bigint",
        nullable: false,
        default: 0,
    }),
    __metadata("design:type", Number)
], CrawlProcess.prototype, "lastProcessedBlock", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], CrawlProcess.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], CrawlProcess.prototype, "updatedAt", void 0);
CrawlProcess = __decorate([
    (0, typeorm_1.Entity)({
        name: "crawl_process",
    })
], CrawlProcess);
exports.default = CrawlProcess;
