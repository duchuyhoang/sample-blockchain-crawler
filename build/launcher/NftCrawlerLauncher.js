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
const utils_1 = require("../common/utils");
const NFTCrawler_1 = __importDefault(require("../fetcher/NFTCrawler"));
const NftCrawlerProcessor_1 = __importDefault(require("../queue/NftCrawlerProcessor"));
const BaseLauncher_1 = __importDefault(require("./base/BaseLauncher"));
class NftCrawlerLauncher extends BaseLauncher_1.default {
    constructor(options) {
        super();
        this.options = options;
    }
    prepare() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    handleStart() {
        return __awaiter(this, void 0, void 0, function* () {
            const nftCrawler = new NFTCrawler_1.default({
                users: [
                    "0xC3217eF1D6027B5AD5404B21a911B952B5F728b4",
                    // "0xDa0933Aa32EC0e09dCF1c035092262C996973265",
                    // "0xBbbb407708Ac44B7ba7509A0F269c66767Fec53A",
                    // "0xC3217eF1D6027B5AD5404B21a911B952B5F728b4",
                    // Web3.utils.toChecksumAddress(
                    //   "0xbe55c43259abbfa2da8fda1ea5e1745145331617"
                    // ),
                ],
                network: this.options.network,
                nextTickTime: 60000,
            });
            yield nftCrawler.start();
            yield (0, utils_1.sleep)(1000);
            const nftProcessor = new NftCrawlerProcessor_1.default();
            yield nftProcessor.start();
        });
    }
}
exports.default = NftCrawlerLauncher;
