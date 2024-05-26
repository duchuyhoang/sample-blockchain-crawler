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
exports.wrapperAsync = exports.packPrice = exports.unpackPrice = exports.sleep = exports.log = exports.getMoralisChain = exports.dateInMiliseconds = void 0;
const enum_1 = require("./enum");
const common_evm_utils_1 = require("@moralisweb3/common-evm-utils");
const util_1 = __importDefault(require("util"));
const hex2dec_1 = __importDefault(require("hex2dec"));
const dateInMiliseconds = () => {
    return Date.now();
};
exports.dateInMiliseconds = dateInMiliseconds;
const getMoralisChain = (network) => {
    const mapNetwork = {
        [enum_1.NETWORK.ETH]: common_evm_utils_1.EvmChain.GOERLI,
        [enum_1.NETWORK.BSC]: common_evm_utils_1.EvmChain.BSC_TESTNET,
        [enum_1.NETWORK.POLYGON]: common_evm_utils_1.EvmChain.MUMBAI,
    };
    return mapNetwork[network] || common_evm_utils_1.EvmChain.GOERLI;
};
exports.getMoralisChain = getMoralisChain;
const log = (object) => {
    console.log(util_1.default.inspect(object, { showHidden: false, depth: null, colors: true }));
};
exports.log = log;
const sleep = (time = 1000) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
});
exports.sleep = sleep;
function unpackPrice(_price) {
    const _scale = 1;
    const paddedString = _price.slice(2);
    let whole = parseFloat(hex2dec_1.default.hexToDec(paddedString.slice(0, 4)));
    let decimal = parseFloat(hex2dec_1.default.hexToDec(paddedString.slice(4)));
    if (whole > 9999) {
        whole = 9999;
    }
    if (decimal > 9999) {
        decimal = 9999;
    }
    const w = whole * _scale;
    const d = (decimal * _scale) / 10000;
    const price = w + d;
    return price;
}
exports.unpackPrice = unpackPrice;
const decimalToPaddedHexString = (number, bitsize) => {
    const byteCount = Math.ceil(bitsize / 8);
    const maxBinValue = Math.pow(2, bitsize) - 1;
    /* In node.js this function fails for bitsize above 32 bits */
    if (bitsize > 32)
        throw "number above maximum value";
    /* Conversion to unsigned form based on  */
    if (number < 0)
        number = maxBinValue + number + 1;
    return ("0x" +
        (number >>> 0)
            .toString(16)
            .toUpperCase()
            .padStart(byteCount * 2, "0"));
};
const packPrice = (price) => {
    if (price > 9999.9999)
        throw new Error("too high");
    const stringVersion = price.toString();
    const parts = stringVersion.split(".");
    let res;
    if (parts.length == 2) {
        const whole = parts[0];
        let decimal = parts[1];
        while (decimal.length < 4) {
            decimal += "0";
        }
        const wholeHex = decimalToPaddedHexString(Number(whole), 16);
        const decimalHex = decimalToPaddedHexString(Number(decimal), 16);
        const hexRepr = wholeHex.concat(decimalHex.slice(2));
        res = hexRepr;
    }
    else {
        if (parts.length != 1)
            throw new Error("price packing issue");
        const whole = parts[0];
        const wholeHex = decimalToPaddedHexString(Number(whole), 16);
        const decimalHex = "0000";
        res = wholeHex.concat(decimalHex);
    }
    return res;
};
exports.packPrice = packPrice;
const wrapperAsync = (asyncFunc) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rs = yield asyncFunc;
        return [rs, null];
    }
    catch (e) {
        return [null, e];
    }
});
exports.wrapperAsync = wrapperAsync;
