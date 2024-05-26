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
const BaseLauncher_1 = __importDefault(require("./base/BaseLauncher"));
const LendRentCrawler_1 = __importDefault(require("../fetcher/LendRentCrawler"));
const LendRentProcessor_1 = __importDefault(require("../queue/LendRentProcessor"));
const utils_1 = require("../common/utils");
const lentRent_1 = __importDefault(require("../configs/lentRent"));
class LentRentLauncher extends BaseLauncher_1.default {
    constructor(options) {
        super();
        this.options = options;
    }
    prepare() {
        return __awaiter(this, void 0, void 0, function* () {
            // Nothing do to
        });
    }
    handleStart() {
        return __awaiter(this, void 0, void 0, function* () {
            const lentRentContract = new LendRentCrawler_1.default(Object.assign({}, lentRent_1.default[this.options.network]));
            yield lentRentContract.start();
            yield (0, utils_1.sleep)(1000);
            const lendRentProcessor = new LendRentProcessor_1.default();
            yield lendRentProcessor.start();
        });
    }
}
exports.default = LentRentLauncher;
