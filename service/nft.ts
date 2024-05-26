import { Repository } from "typeorm";
import { ErcType, NETWORK } from "../common/enum";
import dataSource from "../configs/dataSource";
import Collection from "../entities/Collection";
import NFT from "../entities/NFT";

interface INftService {
  network: NETWORK;
}

export default class NFTService extends Repository<NFT> {
  constructor() {
    super(NFT, dataSource.createEntityManager());
  }
  public async handleSaveNfts(listEvmNft: Array<EvmNftWithNetwork>) {
    listEvmNft.forEach(async (nft) => {
      try {
        if (nft.contractType === ErcType.ERC721) {
          await dataSource.transaction(async (manager) => {
            const queryBuilder = manager.createQueryBuilder();
            const newNft = new NFT();
            const collection = new Collection();

            collection.collectionName = nft.name || null;
            collection.collectionAddress = nft.tokenAddress.checksum;
            collection.network = nft.network;

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

            await queryBuilder
              .insert()
              .into(NFT)
              .values(newNft)
              .onConflict(
                `(collection_address,token_id,network) DO UPDATE SET "nft_name" = :nft_name ,nft_metadata = :nft_metadata,"owner_address" = :owner_address`
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

  public async getNftByTokenIdNetworkAndCollection(payload: {
    collectionAddress: string;
    tokenId: string;
    network: NETWORK;
  }) {
    return this.findOne({
      where: payload,
    });
  }
}
