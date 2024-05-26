import { EvmChain } from "@moralisweb3/common-evm-utils";
import Moralis from "moralis";

interface IGetUserWalletNft {
  user_address: string;
  chain: EvmChain;
  cursor?: string;
}

export default class MoralisService {
  constructor() {}
  public async getUserNft(options: IGetUserWalletNft) {
    return await Moralis.EvmApi.nft.getWalletNFTs({
      address: options.user_address,
      chain: options.chain,
      cursor: options.cursor,
    });
  }
}
