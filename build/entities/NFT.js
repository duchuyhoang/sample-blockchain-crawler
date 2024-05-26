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
const enum_1 = require("../common/enum");
const Loan_1 = __importDefault(require("./Loan"));
let NFT = class NFT {
    beforeInsert() {
        this.collectionAddress = web3_1.default.utils.toChecksumAddress(this.collectionAddress);
        this.ownerAddress = web3_1.default.utils.toChecksumAddress(this.ownerAddress);
        if (this.tokenId.startsWith("0x")) {
            this.tokenId = web3_1.default.utils.hexToNumber(this.tokenId).toString();
        }
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], NFT.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "token_id",
    }),
    __metadata("design:type", String)
], NFT.prototype, "tokenId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "collection_address",
        nullable: false,
    }),
    __metadata("design:type", String)
], NFT.prototype, "collectionAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "owner_address",
        nullable: false,
    }),
    __metadata("design:type", String)
], NFT.prototype, "ownerAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "nft_name",
        nullable: true,
        type: "text",
    }),
    __metadata("design:type", Object)
], NFT.prototype, "nftName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "nft_metadata",
        nullable: true,
        type: "jsonb",
    }),
    __metadata("design:type", Object)
], NFT.prototype, "nftMetadata", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "network",
        nullable: false,
        default: enum_1.NETWORK.ETH,
    }),
    __metadata("design:type", String)
], NFT.prototype, "network", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Loan_1.default, (loan) => loan.nft),
    __metadata("design:type", Array)
], NFT.prototype, "loans", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], NFT.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], NFT.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NFT.prototype, "beforeInsert", null);
NFT = __decorate([
    (0, typeorm_1.Entity)({
        name: "nft",
    }),
    (0, typeorm_1.Unique)(["collectionAddress", "tokenId", "network"]),
    (0, typeorm_1.Index)(["collectionAddress", "ownerAddress", "tokenId"])
], NFT);
exports.default = NFT;
