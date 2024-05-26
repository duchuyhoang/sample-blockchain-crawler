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
const typeorm_1 = require("typeorm");
const dataSource_1 = __importDefault(require("../configs/dataSource"));
const Loan_1 = __importDefault(require("../entities/Loan"));
class LoanService extends typeorm_1.Repository {
    constructor() {
        super(Loan_1.default, dataSource_1.default.createEntityManager());
    }
    getLoanByLoanIdAndNetwork({ lendingId, network, }) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findOne({
                where: {
                    network,
                    lendingId,
                },
                relations: ["nft"],
            });
        });
    }
}
exports.default = LoanService;
