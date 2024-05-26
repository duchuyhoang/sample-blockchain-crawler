import { BaseIntervalWorker } from "./BaseIntervalWorker";
import Web3 from "web3";
import dataSource from "../../configs/dataSource";
import CrawlProcess from "../../entities/CrawlProcess";
import ERC721 from "../../abi/ERC721.json";
import { Interface, JsonRpcProvider } from "ethers";
import { DEFAULT_BREAK_TIME_AFTER_ONE_GO } from "../../common/constant";
import { NETWORK } from "../../common/enum";
export interface IEventCrawler {
  networkConfigs: {
    contract: {
      contractName: string;
      contractAddress: string;
      contractAbi: any;
    };

    rpcUrl: string;
    network: NETWORK;
    blockPerOneGo: number;
    averageBlockTime: number;
    latestFromNetwork: boolean;
    confirmationBlock: number;
    latestBlock?: number;
  };
}

abstract class BaseEventCrawler<R> extends BaseIntervalWorker {
  private LATEST_BLOCK_FROM_NETWORK: number = NaN;
  private LATEST_PROCESSED_BLOCK: number = NaN;
  private crawlProcess: CrawlProcess;
  constructor(protected options: IEventCrawler) {
    super();
  }

  protected abstract handleCrawledEvents(datas: Array<R>): Promise<void>;

  protected async processBlock({
    fromBlock,
    toBlock,
    latestNetworkBlock,
  }: {
    fromBlock: number;
    toBlock: number;
    latestNetworkBlock: number;
  }) {
    const web3 = new Web3(this.getNetworkConfigs().rpcUrl);
    const contract = new web3.eth.Contract(
      this.getContractConfigs().contractAbi,
      this.getContractConfigs().contractAddress
    );
    console.log(
      `Begin process from ${fromBlock} to ${toBlock} / Latest network block: ${latestNetworkBlock}`
    );

    const eventLogs = await contract.getPastEvents(
      "allEvents",
      {
        fromBlock,
        toBlock,
      },
      (err: any) => {
        !!err && console.log("Crawl event from sc:", err);
      }
    );
    // console.log("total crawled data:", eventLogs);
    const formattedEventLogs = eventLogs;

    await this.handleCrawledEvents(
      formattedEventLogs
        .sort((a, b) => a.blockNumber - b.blockNumber)
        .map(
          (event) =>
            ({
              event: event.event,
              data: event.returnValues,
              blockNumber: event.blockNumber,
            } as R)
        )
    );
  }

  protected getNetworkConfigs() {
    this.getBlockData;
    return this.options.networkConfigs;
  }
  protected getContractConfigs() {
    return this.options.networkConfigs.contract;
  }
  protected getCurLatestProcessedBlock() {
    return parseInt(this.LATEST_PROCESSED_BLOCK.toString(), 10);
  }

  protected async doProcess() {
    if (!this.crawlProcess) {
      console.log(`No crawling process found for : ${this.constructor.name}`);
      return;
    }
    const latestBlockFromNetwork = await this.getNetworkLatestBlockNumber();

    this.LATEST_BLOCK_FROM_NETWORK = latestBlockFromNetwork;

    this.LATEST_PROCESSED_BLOCK = this.crawlProcess.lastProcessedBlock;

    let latestProcessedBlock = this.getCurLatestProcessedBlock();

    const fromBlockNumber =
      latestProcessedBlock === 0 ? 0 : latestProcessedBlock + 1;

    if (fromBlockNumber > latestBlockFromNetwork) {
      console.log(`Block ${fromBlockNumber} is the newest block`);
      return;
    }

    let toBlockNumber =
      fromBlockNumber + this.getNetworkConfigs().blockPerOneGo;
    if (toBlockNumber > latestBlockFromNetwork) {
      console.log("To block is higher");
      toBlockNumber = latestBlockFromNetwork;
    }

    console.log(
      `FROM ${fromBlockNumber} TO ${toBlockNumber} LATEST ${latestBlockFromNetwork}`
    );

    await this.processBlock({
      fromBlock: fromBlockNumber,
      toBlock: toBlockNumber,
      latestNetworkBlock: latestBlockFromNetwork,
    });

    const crawlProcessRepository = dataSource.getRepository(CrawlProcess);
    this.crawlProcess.lastProcessedBlock = toBlockNumber;
    await crawlProcessRepository.save(this.crawlProcess);

    this.LATEST_PROCESSED_BLOCK = toBlockNumber;

    // Have processed latest network block so set next tick time by average time
    if (fromBlockNumber === toBlockNumber) {
      this.setNextTickTime(this.getNetworkConfigs().averageBlockTime);
    } else {
      this.setNextTickTime(DEFAULT_BREAK_TIME_AFTER_ONE_GO);
    }
  }

  public async getBlockData(block_number: string | number) {
    const web3 = new Web3(this.getNetworkConfigs().rpcUrl);
    return web3.eth.getBlock(block_number);
  }

  public async getTransactionData(block_number: string | number) {
    const jsonProvider = new JsonRpcProvider(this.getNetworkConfigs().rpcUrl);
    const inter = new Interface(this.getContractConfigs().contractAbi);
    const blockData = await this.getBlockData(block_number);

    const datas = await Promise.all(
      blockData.transactions.map(async (transaction) => {
        const tx = await jsonProvider.getTransaction(transaction);
        if (tx?.data) {
          const decodedOutput = inter.parseTransaction({
            data: tx.data,
            value: tx.value,
          });
          return decodedOutput;
        }
        return null;
      })
    );
    return datas.filter((data) => !!data);
  }

  protected async getNetworkLatestBlockNumber() {
    const web3 = new Web3(this.getNetworkConfigs().rpcUrl);
    const latestBlockFromNetwork = await web3.eth.getBlockNumber();
    console.log(
      "network",
      latestBlockFromNetwork,
      "real:",
      latestBlockFromNetwork - this.getNetworkConfigs().confirmationBlock
    );
    return latestBlockFromNetwork - this.getNetworkConfigs().confirmationBlock;
  }

  protected async prepare() {
    const crawlProcessRepository = dataSource.getRepository(CrawlProcess);
    const latestBlockFromNetwork = await this.getNetworkLatestBlockNumber();

    let crawlerProcess = await crawlProcessRepository
      .createQueryBuilder("CrawlProcess")
      .where({
        contractAddress: this.getContractConfigs().contractAddress,
      })
      .andWhere({
        contractName: this.getContractConfigs().contractName,
      })
      .getOne();

    if (!crawlerProcess) {
      const newCrawlProcess = new CrawlProcess();
      newCrawlProcess.contractAddress =
        this.getContractConfigs().contractAddress;
      newCrawlProcess.contractName = this.getContractConfigs().contractName;
      newCrawlProcess.lastProcessedBlock = this.getNetworkConfigs()
        .latestFromNetwork
        ? latestBlockFromNetwork === 0
          ? 0
          : latestBlockFromNetwork - 1
        : (this.getNetworkConfigs().latestBlock || 0) - 1;
      try {
        this.crawlProcess = await crawlProcessRepository.save(newCrawlProcess);
      } catch (e: any) {
        console.log(`Error while insert new crawling process: ${e.message}`);
      }
    } else {
      const crawlProcessRepository = dataSource.getRepository(CrawlProcess);
      crawlerProcess.lastProcessedBlock = this.getNetworkConfigs()
        .latestFromNetwork
        ? latestBlockFromNetwork === 0
          ? 0
          : latestBlockFromNetwork - 1
        : (this.getNetworkConfigs().latestBlock || 0) - 1;
      await crawlProcessRepository.save(crawlerProcess);

      this.crawlProcess = crawlerProcess;
    }
  }
}

export default BaseEventCrawler;
