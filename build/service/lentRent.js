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
const enum_1 = require("../common/enum");
const utils_1 = require("../common/utils");
const dataSource_1 = __importDefault(require("../configs/dataSource"));
const Loan_1 = __importDefault(require("../entities/Loan"));
const loan_1 = __importDefault(require("./loan"));
const nft_1 = __importDefault(require("./nft"));
const bignumber_js_1 = require("bignumber.js");
class LendRentService {
    constructor() {
        this.loanService = new loan_1.default();
    }
    // User start listing their nft can be rented
    handleLentEvent(queueLog) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = queueLog.data;
            const queryRunner = dataSource_1.default.createQueryRunner();
            const nftService = new nft_1.default();
            try {
                let loan = yield this.loanService.getLoanByLoanIdAndNetwork({
                    lendingId: data.lendingId,
                    network: data.network,
                });
                const nft = yield nftService.getNftByTokenIdNetworkAndCollection({
                    collectionAddress: data.nftAddress,
                    network: data.network,
                    tokenId: data.tokenId.toString(),
                });
                if (!nft) {
                    return [null, new Error("Nft doesn't exist in system")];
                }
                if (!loan) {
                    loan = new Loan_1.default();
                }
                else {
                    if (loan.nft.id !== nft.id) {
                        return [null, new Error("Nft doesn't exist in system")];
                    }
                }
                // Update nft owner based on lender
                nft.ownerAddress = data.lenderAddress;
                // Update loan
                loan.lenderAddress = nft.ownerAddress;
                loan.renterAddress = null;
                loan.lendingId = data.lendingId;
                loan.dailyFee = (0, utils_1.unpackPrice)(data.dailyRentPrice).toString();
                loan.lentAmount = parseInt(data.lentAmount);
                loan.maxRentDuration = parseInt(data.maxRentDuration);
                loan.network = data.network;
                loan.useNativeToken = data.useNativeToken;
                loan.nft = nft;
                loan.status = enum_1.LoanStatus.LISTING;
                loan.collateral = (0, utils_1.unpackPrice)(data.nftPrice).toString();
                loan.dailyFee = (0, utils_1.unpackPrice)(data.dailyRentPrice).toString();
                yield queryRunner.connect();
                yield queryRunner.startTransaction();
                yield queryRunner.manager.save(nft);
                yield queryRunner.manager.save(loan);
                yield queryRunner.commitTransaction();
                return [loan, null];
            }
            catch (e) {
                yield queryRunner.rollbackTransaction();
                return [null, e];
            }
            finally {
                yield queryRunner.release();
            }
        });
    }
    handleRentEvent(queueLog) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = queueLog.data;
            const loan = yield this.loanService.getLoanByLoanIdAndNetwork({
                lendingId: data.lendingId,
                network: data.network,
            });
            if (!loan) {
                return [null, "Loan not exist"];
            }
            if (loan.status !== enum_1.LoanStatus.LISTING) {
                return [null, "Loan is not listing"];
            }
            const nft = loan.nft;
            // Update nft owner
            nft.ownerAddress = data.renterAddress;
            //Update loan info
            loan.startDate = (parseInt(data.rentedAt.toString()) * 1000).toString();
            loan.rentDuration = data.rentDuration;
            loan.status = enum_1.LoanStatus.RENTING;
            loan.latestPrice = new bignumber_js_1.BigNumber(loan.collateral)
                .plus(new bignumber_js_1.BigNumber(loan.dailyFee).multipliedBy(new bignumber_js_1.BigNumber(data.rentDuration)))
                .toString();
            const queryRunner = dataSource_1.default.createQueryRunner();
            try {
                yield queryRunner.connect();
                yield queryRunner.startTransaction();
                yield queryRunner.manager.save(nft);
                yield queryRunner.manager.save(loan);
                yield queryRunner.commitTransaction();
                return [loan, null];
            }
            catch (e) {
                yield queryRunner.rollbackTransaction();
                return [e, null];
            }
            finally {
                yield queryRunner.release();
            }
            // return dataSource.transaction(async (manager: EntityManager) => {
            //   //   const {};
            // });
        });
    }
    handleStopLending(queueLog) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = queueLog.data;
            const loan = yield this.loanService.getLoanByLoanIdAndNetwork({
                lendingId: data.lendingId,
                network: data.network,
            });
            if (!loan) {
                return [null, "Loan not exist"];
            }
            loan.status = enum_1.LoanStatus.CLOSED;
            loan.latestPrice = null;
            loan.rentDuration = null;
            const queryRunner = dataSource_1.default.createQueryRunner();
            try {
                yield queryRunner.connect();
                yield queryRunner.startTransaction();
                yield queryRunner.manager.save(loan);
                return [loan, null];
            }
            catch (e) {
                yield queryRunner.rollbackTransaction();
                return [null, e];
            }
            finally {
                yield queryRunner.release();
            }
        });
    }
}
exports.default = LendRentService;
