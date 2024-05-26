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
const enum_1 = require("../common/enum");
const NFT_1 = __importDefault(require("./NFT"));
const web3_1 = __importDefault(require("web3"));
let Loans = class Loans {
    beforeInsert() {
        if (this.lenderAddress)
            this.lenderAddress = web3_1.default.utils.toChecksumAddress(this.lenderAddress);
        if (this.renterAddress)
            this.renterAddress = web3_1.default.utils.toChecksumAddress(this.renterAddress);
    }
    beforeUpdate() {
        if (this.lenderAddress)
            this.lenderAddress = web3_1.default.utils.toChecksumAddress(this.lenderAddress);
        if (this.renterAddress)
            this.renterAddress = web3_1.default.utils.toChecksumAddress(this.renterAddress);
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", Object)
], Loans.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, name: "loan_id" }),
    __metadata("design:type", String)
], Loans.prototype, "lendingId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: "network" }),
    __metadata("design:type", String)
], Loans.prototype, "network", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => NFT_1.default, (nft) => nft.id),
    (0, typeorm_1.JoinColumn)({
        name: "nft",
    }),
    __metadata("design:type", NFT_1.default)
], Loans.prototype, "nft", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, name: "max_rent_duration" }),
    __metadata("design:type", Number)
], Loans.prototype, "maxRentDuration", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, name: "daily_fee" }),
    __metadata("design:type", String)
], Loans.prototype, "dailyFee", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, name: "collateral", type: "float" }),
    __metadata("design:type", String)
], Loans.prototype, "collateral", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: "latest_price", type: "float" }),
    __metadata("design:type", Object)
], Loans.prototype, "latestPrice", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], Loans.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], Loans.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: "start_rent_date", type: "text" }),
    __metadata("design:type", String)
], Loans.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: "rent_duration", type: "integer" }),
    __metadata("design:type", Object)
], Loans.prototype, "rentDuration", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: "total_rent_amount" }),
    __metadata("design:type", String)
], Loans.prototype, "totalRentAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, name: "use_native_token" }),
    __metadata("design:type", Boolean)
], Loans.prototype, "useNativeToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, name: "lent_amount", default: 1 }),
    __metadata("design:type", Number)
], Loans.prototype, "lentAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: "lender_address" }),
    __metadata("design:type", String)
], Loans.prototype, "lenderAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: "renter_address", type: "text" }),
    __metadata("design:type", Object)
], Loans.prototype, "renterAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, default: enum_1.LoanStatus.LISTING }),
    __metadata("design:type", String)
], Loans.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Loans.prototype, "beforeInsert", null);
__decorate([
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Loans.prototype, "beforeUpdate", null);
Loans = __decorate([
    (0, typeorm_1.Entity)({
        name: "loans",
    })
], Loans);
exports.default = Loans;
