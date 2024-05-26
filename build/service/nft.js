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
const enum_1 = require("../common/enum");
const dataSource_1 = __importDefault(require("../configs/dataSource"));
const Collection_1 = __importDefault(require("../entities/Collection"));
const NFT_1 = __importDefault(require("../entities/NFT"));
class NFTService extends typeorm_1.Repository {
    constructor() {
        super(NFT_1.default, dataSource_1.default.createEntityManager());
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
                            collection.network = nft.network;
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
                            yield queryBuilder
                                .insert()
                                .into(NFT_1.default)
                                .values(newNft)
                                .onConflict(`(collection_address,token_id,network) DO UPDATE SET "nft_name" = :nft_name ,nft_metadata = :nft_metadata,"owner_address" = :owner_address`)
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
    getNftByTokenIdNetworkAndCollection(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findOne({
                where: payload,
            });
        });
    }
}
exports.default = NFTService;
