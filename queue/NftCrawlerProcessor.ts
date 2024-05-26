import { QUEUE_NAMES } from "../common/constant";
import Processor from "./base/Processor";
import Bull from "bull";
import MoralisService from "../service/moralis";
import { NETWORK, QueueStatus } from "../common/enum";
import { dateInMiliseconds, getMoralisChain, sleep } from "../common/utils";
import NFTService from "../service/nft";
import { EntityManager } from "typeorm";
import QueueLog from "../entities/QueueLog";
import QueueManagement from ".";
import dataSource from "../configs/dataSource";
import { EvmNft } from "@moralisweb3/evm-utils";

type NftCrawlerJob = Bull.Job<
  QueueLog & {
    cursor?: string;
  }
>;

class NftCrawlerProcessor extends Processor {
  constructor() {
    super(QUEUE_NAMES.NFT_QUEUE);
    this.setNextTickTime(10000);
    this.setConcurrency(1);
  }
  protected async prepare(): Promise<void> {
    this.queueInstance.process(
      this.getConcurrency() || 2,
      async (job: NftCrawlerJob, done) => {
        try {
          const { user_address, network } = job.data.data;
          let moralisNfts: Array<EvmNft> = [];
          const chain = getMoralisChain(network);
          const moralisService = new MoralisService();
          const response = await moralisService.getUserNft({
            user_address,
            chain: chain,
          });
          const nftService = new NFTService();

          let cursor = response.pagination.cursor;
          moralisNfts = [...response.result];

          while (!!cursor) {
            const loopResponse = await moralisService.getUserNft({
              user_address,
              chain: chain,
              cursor,
            });

            moralisNfts = moralisNfts.concat(loopResponse.result);

            cursor = loopResponse.pagination.cursor;
            // Avoid moralis break if request too much
            await sleep(1000);
          }
          await nftService.handleSaveNfts(
            response.result.map(
              (rs) =>
                ({
                  ...(rs as any)._data,
                  network,
                } as EvmNftWithNetwork)
            )
          );
          console.log(
            `Succeed crawl user ${user_address} total : ${moralisNfts.length}`
          );
          done(
            null,
            `Succeed crawl user : ${user_address} nfts with no cursor`
          );
        } catch (e: any) {
          console.log(e);
          done(new Error(e));
        }
      }
    );

    this.queueInstance.on("failed", async (job) => {
      try {
        await QueueManagement.handleFailedQueueLog(job.data);
      } catch (e) {}
      // this.queueInstance;
    });
  }
  protected async handleUnfinishedOrFailedTask(
    manager: EntityManager,
    listTasks: QueueLog[]
  ): Promise<void> {
    listTasks.forEach(async (queueLog: QueueLog) => {
      try {
        const data = queueLog;
        this.queueInstance.add(data, {
          removeOnComplete: true,
        });
      } catch (e) {
        // Retry at 30s
        await QueueManagement.handleFailedQueueLog(queueLog);
      }
    });
  }

  // protected async doProcess(): Promise<void> {}
}

export default NftCrawlerProcessor;
