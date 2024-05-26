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
const BaseIntervalWorker_1 = require("./base/BaseIntervalWorker");
const nft_queue_1 = __importDefault(require("../queue/nft.queue"));
const enum_1 = require("../common/enum");
const utils_1 = require("../common/utils");
const common_evm_utils_1 = require("@moralisweb3/common-evm-utils");
const constant_1 = require("../common/constant");
const dataSource_1 = __importDefault(require("../configs/dataSource"));
const NFT_1 = __importDefault(require("../entities/NFT"));
const Collection_1 = __importDefault(require("../entities/Collection"));
const queue_1 = require("../queue");
class NFTCrawler extends BaseIntervalWorker_1.BaseIntervalWorker {
    constructor(options) {
        super();
        this.options = options;
        this.chain = common_evm_utils_1.EvmChain.GOERLI;
        queue_1.queueManagement.register(constant_1.QUEUE_NAMES.NFT_QUEUE, nft_queue_1.default);
    }
    handleSaveNfts(listEvmNft) {
        return __awaiter(this, void 0, void 0, function* () {
            listEvmNft.forEach((nft) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (nft.contractType === enum_1.ErcType.ERC721) {
                        yield dataSource_1.default.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                            var _a, _b;
                            const queryBuilder = manager.createQueryBuilder();
                            const newNft = new NFT_1.default();
                            const collection = new Collection_1.default();
                            collection.collectionName = nft.name || null;
                            collection.collectionAddress = nft.tokenAddress.checksum;
                            collection.network = this.options.network;
                            yield queryBuilder
                                .insert()
                                .into(Collection_1.default)
                                .values(collection)
                                .onConflict(`(collection_address,network) DO UPDATE SET "collection_name" = :collection_name`)
                                .setParameters({
                                collection_name: collection.collectionName,
                            })
                                .execute();
                            let metadata = null;
                            try {
                                newNft.nftName = nft.name || "";
                                if (nft.metadata) {
                                    metadata = nft.metadata;
                                    newNft.nftMetadata = JSON.stringify(nft.metadata);
                                }
                            }
                            catch (e) {
                                newNft.nftMetadata = null;
                            }
                            newNft.nftName = (metadata === null || metadata === void 0 ? void 0 : metadata.name) || null;
                            newNft.nftMetadata = metadata;
                            newNft.ownerAddress = (_a = nft.ownerOf) === null || _a === void 0 ? void 0 : _a.checksum;
                            newNft.collectionAddress = nft.tokenAddress.checksum;
                            newNft.tokenId = (_b = nft.tokenId) === null || _b === void 0 ? void 0 : _b.toString();
                            newNft.network = this.options.network;
                            yield queryBuilder
                                .insert()
                                .into(NFT_1.default)
                                .values(newNft)
                                .onConflict(`(collection_address,token_id) DO UPDATE SET "nft_name" = :nft_name ,nft_metadata = :nft_metadata,"owner_address" = :owner_address`)
                                .setParameters({
                                nft_name: newNft.nftName,
                                nft_metadata: newNft.nftMetadata,
                                owner_address: newNft.ownerAddress,
                            })
                                .execute();
                        }));
                    }
                }
                catch (e) {
                    console.log(e);
                }
            }));
        });
    }
    prepare() {
        return __awaiter(this, void 0, void 0, function* () {
            this.chain = (0, utils_1.getMoralisChain)(this.options.network);
            this.setNextTickTime(this.options.nextTickTime || 15000);
            this.setProcessingTimeout(10000);
        });
    }
    doProcess() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all(this.options.users.map((user_address) => {
                return queue_1.queueManagement.insertQueueLog(constant_1.QUEUE_NAMES.NFT_QUEUE, {
                    user_address,
                    network: this.options.network,
                });
            }));
        });
    }
}
exports.default = NFTCrawler;
