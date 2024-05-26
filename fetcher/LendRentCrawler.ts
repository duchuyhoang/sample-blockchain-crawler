import Web3 from "web3";
import BaseEventCrawler, { IEventCrawler } from "./base/BaseEventCrawler";
import fs from "fs";
import path from "path";
import dataSource from "../configs/dataSource";
import { EntityManager } from "typeorm";
import QueueManagement, { queueManagement } from "../queue";
import { QUEUE_NAMES } from "../common/constant";
import lendRentQueue from "../queue/lentRent.queue";
import { NETWORK } from "../common/enum";

export type LendRentCrawledEvent = {
  event: string;
  data: any;
  blockNumber: number;
};

export type LendRentQueueLogData = LendRentCrawledEvent & {
  network: NETWORK;
};

class LendRentCrawler extends BaseEventCrawler<LendRentCrawledEvent> {
  constructor(protected options: IEventCrawler) {
    super(options);
    queueManagement.register(QUEUE_NAMES.LEND_RENT, lendRentQueue);
    this.setNextTickTime(this.options.networkConfigs.averageBlockTime);
    this.setProcessingTimeout(10000);
  }

  protected async handleCrawledEvents(
    datas: Array<LendRentQueueLogData>
  ): Promise<void> {
    datas.forEach(async (data) => {
      await queueManagement.insertQueueLog<LendRentQueueLogData>(
        QUEUE_NAMES.LEND_RENT,
        {
          ...data.data,
          event: data.event,
          network: this.options.networkConfigs.network,
        }
      );
    });
  }
}

export default LendRentCrawler;
