import { NETWORK } from "../common/enum";
import BaseLauncher from "./base/BaseLauncher";
import LendRentCrawler from "../fetcher/LendRentCrawler";
import LendRentProcessor from "../queue/LendRentProcessor";
import { sleep } from "../common/utils";
import lentRentConfigs from "../configs/lentRent";
interface ILentRentLauncher {
  network: NETWORK;
}
export default class LentRentLauncher extends BaseLauncher {
  constructor(private options: ILentRentLauncher) {
    super();
  }
  protected async prepare(): Promise<void> {
    // Nothing do to
  }
  protected async handleStart(): Promise<void> {
    const lentRentContract = new LendRentCrawler({
      ...lentRentConfigs[this.options.network],
      //   networkConfigs: {
      //     contract: {
      //       contractName: "GOERLI_LEND_RENT",
      //       contractAddress: process.env.LEND_RENT_ADDRESS!,
      //       contractAbi: LendRentAbi,
      //     },

      //     network: NETWORK.ETH,
      //     rpcUrl: process.env.ETH_RPC_URL!,
      //     blockPerOneGo: Number(process.env.BLOCK_PER_GO! || 200),
      //     latestFromNetwork: true,
      //     latestBlock: 8657315,
      //     confirmationBlock: parseInt(
      //       process.env.GOERLI_REQUIRE_CONFIRMATION!,
      //       10
      //     ),
      //     averageBlockTime: parseInt(process.env.GOERLI_AVERAGE_BLOCK_TIME!, 10),
      //   },
    });
    await lentRentContract.start();
    await sleep(1000);
    const lendRentProcessor = new LendRentProcessor();
    await lendRentProcessor.start();
  }
}
