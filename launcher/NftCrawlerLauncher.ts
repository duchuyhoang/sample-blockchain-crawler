import { NETWORK } from "../common/enum";
import { sleep } from "../common/utils";
import NFTCrawler from "../fetcher/NFTCrawler";
import NftCrawlerProcessor from "../queue/NftCrawlerProcessor";
import BaseLauncher from "./base/BaseLauncher";

interface INftCrawlerLauncher {
  network: NETWORK;
}

export default class NftCrawlerLauncher extends BaseLauncher {
  constructor(private options: INftCrawlerLauncher) {
    super();
  }
  protected async prepare() {}
  protected async handleStart() {
    const nftCrawler = new NFTCrawler({
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
    await nftCrawler.start();
    await sleep(1000);
    const nftProcessor = new NftCrawlerProcessor();
    await nftProcessor.start();
  }
}
