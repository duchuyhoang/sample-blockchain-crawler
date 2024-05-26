"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const enum_1 = require("../common/enum");
const LendRent_json_1 = __importDefault(require("../abi/LendRent.json"));
const lentRentConfigs = {
    [enum_1.NETWORK.ETH]: {
        networkConfigs: {
            contract: {
                contractName: "GOERLI_LEND_RENT",
                contractAddress: process.env.LEND_RENT_ADDRESS,
                contractAbi: LendRent_json_1.default,
            },
            network: enum_1.NETWORK.ETH,
            rpcUrl: process.env.ETH_RPC_URL,
            blockPerOneGo: Number(process.env.BLOCK_PER_GO || 200),
            latestFromNetwork: true,
            latestBlock: 8657315,
            confirmationBlock: parseInt(process.env.GOERLI_REQUIRE_CONFIRMATION, 10),
            averageBlockTime: parseInt(process.env.GOERLI_AVERAGE_BLOCK_TIME, 10),
        },
    },
};
exports.default = lentRentConfigs;
