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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const web3_1 = __importDefault(require("web3"));
let Collection = class Collection {
    beforeInsert() {
        this.collectionAddress = web3_1.default.utils.toChecksumAddress(this.collectionAddress);
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid", {
        name: "collection_id",
    }),
    __metadata("design:type", String)
], Collection.prototype, "collectionId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "collection_address",
        nullable: false,
    }),
    __metadata("design:type", String)
], Collection.prototype, "collectionAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "collection_name",
        nullable: true,
        type: "text",
    }),
    __metadata("design:type", Object)
], Collection.prototype, "collectionName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, name: "network" }),
    __metadata("design:type", String)
], Collection.prototype, "network", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], Collection.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], Collection.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Collection.prototype, "beforeInsert", null);
Collection = __decorate([
    (0, typeorm_1.Entity)({
        name: "collection",
    }),
    (0, typeorm_1.Unique)(["collectionAddress", "network"]),
    (0, typeorm_1.Index)(["collectionAddress", "network"])
], Collection);
exports.default = Collection;
