import dataSource from "../configs/dataSource";
import CrawlProcess from "../entities/CrawlProcess";
import NFT from "../entities/NFT";
import QueueLog from "../entities/QueueLog";

// const repositoryManager = {
  const crawlProcessRepository = dataSource.getRepository(CrawlProcess);
  const nftRepository =  dataSource.getRepository(NFT);
  const queueLogRepository = dataSource.getRepository(QueueLog);
// };

export {
    crawlProcessRepository,
    queueLogRepository,
    nftRepository
}