import { NETWORK } from "../common/enum";
import LendRentAbi from "../abi/LendRent.json";
const lentRentConfigs: {
  [key: string]: any;
} = {
  [NETWORK.ETH]: {
    networkConfigs: {
      contract: {
        contractName: "GOERLI_LEND_RENT",
        contractAddress: process.env.LEND_RENT_ADDRESS!,
        contractAbi: LendRentAbi,
      },

      network: NETWORK.ETH,
      rpcUrl: process.env.ETH_RPC_URL!,
      blockPerOneGo: Number(process.env.BLOCK_PER_GO! || 200),
      latestFromNetwork: true,
      latestBlock: 8657315,
      confirmationBlock: parseInt(process.env.GOERLI_REQUIRE_CONFIRMATION!, 10),
      averageBlockTime: parseInt(process.env.GOERLI_AVERAGE_BLOCK_TIME!, 10),
    },
  },
};

export default lentRentConfigs;
