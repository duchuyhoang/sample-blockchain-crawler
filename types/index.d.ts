import { EvmNft } from "@moralisweb3/evm-utils";
import { QUEUE_NAMES } from "../common/constant";
import { NETWORK } from "../common/enum";

export declare global {
  type Maybe<T> = T | null;
  type ValueOf<T> = T[keyof T];
  type QueueName = ValueOf<typeof QUEUE_NAMES>;
  type EvmNftWithNetwork = EvmNft & {
    network: NETWORK;
  };
}
