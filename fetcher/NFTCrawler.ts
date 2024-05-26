import { BaseIntervalWorker } from "./base/BaseIntervalWorker";
import nftQueue from "../queue/nft.queue";

import { NETWORK, ErcType, QueueStatus, QueueLogEvent } from "../common/enum";
import { dateInMiliseconds, getMoralisChain, log } from "../common/utils";
import { EvmChain, EvmNft, EvmAddress } from "@moralisweb3/common-evm-utils";
import Bull from "bull";
import { QUEUE_NAMES } from "../common/constant";
import MoralisService from "../service/moralis";
import dataSource from "../configs/dataSource";
import NFT from "../entities/NFT";
import Collection from "../entities/Collection";
import QueueLog from "../entities/QueueLog";
import { EntityManager } from "typeorm";
import { queueManagement } from "../queue";
interface INFTCrawler {
  users: Array<string>;
  network: NETWORK;
  nextTickTime?: number;
  concurrency?: number;
}

class NFTCrawler extends BaseIntervalWorker {
  private chain: EvmChain = EvmChain.GOERLI;
  constructor(private options: INFTCrawler) {
    super();
    queueManagement.register(QUEUE_NAMES.NFT_QUEUE, nftQueue);
  }

  public async handleSaveNfts(listEvmNft: Array<EvmNft>) {
    listEvmNft.forEach(async (nft) => {
      try {
        if (nft.contractType === ErcType.ERC721) {
          await dataSource.transaction(async (manager) => {
            const queryBuilder = manager.createQueryBuilder();
            const newNft = new NFT();
            const collection = new Collection();

            collection.collectionName = nft.name || null;
            collection.collectionAddress = nft.tokenAddress.checksum;
            collection.network = this.options.network;

            await queryBuilder
              .insert()
              .into(Collection)
              .values(collection)
              .onConflict(
                `(collection_address,network) DO UPDATE SET "collection_name" = :collection_name`
              )
              .setParameters({
                collection_name: collection.collectionName,
              })
              .execute();

            let metadata: any = null;
            try {
              newNft.nftName = nft.name || "";
              if (nft.metadata) {
                metadata = nft.metadata;
                newNft.nftMetadata = JSON.stringify(nft.metadata);
              }
            } catch (e) {
              newNft.nftMetadata = null;
            }

            newNft.nftName = metadata?.name || null;
            newNft.nftMetadata = metadata;
            newNft.ownerAddress = nft.ownerOf?.checksum!;
            newNft.collectionAddress = nft.tokenAddress.checksum;
            newNft.tokenId = nft.tokenId?.toString();
            newNft.network = this.options.network;

            await queryBuilder
              .insert()
              .into(NFT)
              .values(newNft)
              .onConflict(
                `(collection_address,token_id) DO UPDATE SET "nft_name" = :nft_name ,nft_metadata = :nft_metadata,"owner_address" = :owner_address`
              )
              .setParameters({
                nft_name: newNft.nftName,
                nft_metadata: newNft.nftMetadata,
                owner_address: newNft.ownerAddress,
              })
              .execute();
          });
        }
      } catch (e) {
        console.log(e);
      }
    });
  }

  public async prepare(): Promise<void> {
    this.chain = getMoralisChain(this.options.network);
    this.setNextTickTime(this.options.nextTickTime || 15000);
    this.setProcessingTimeout(10000);
  }

  public async doProcess(): Promise<void> {
    await Promise.all(
      this.options.users.map((user_address: string) => {
        return queueManagement.insertQueueLog(QUEUE_NAMES.NFT_QUEUE, {
          user_address,
          network: this.options.network,
        });
      })
    );
  }
}

export default NFTCrawler;
