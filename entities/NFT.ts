import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  Index,
  Unique,
  OneToMany,
} from "typeorm";
import Web3 from "web3";
import { NETWORK } from "../common/enum";
import Loans from "./Loan";
@Entity({
  name: "nft",
})
@Unique(["collectionAddress", "tokenId", "network"])
@Index(["collectionAddress", "ownerAddress", "tokenId"])
export default class NFT {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column({
    name: "token_id",
  })
  tokenId: string;

  @Column({
    name: "collection_address",
    nullable: false,
  })
  collectionAddress: string;

  @Column({
    name: "owner_address",
    nullable: false,
  })
  ownerAddress: string;

  @Column({
    name: "nft_name",
    nullable: true,
    type: "text",
  })
  nftName: string | null;

  @Column({
    name: "nft_metadata",
    nullable: true,
    type: "jsonb",
  })
  nftMetadata: any;

  @Column({
    name: "network",
    nullable: false,
    default: NETWORK.ETH,
  })
  network: NETWORK;

  @OneToMany(() => Loans, (loan) => loan.nft)
  loans: Array<Loans>;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @BeforeInsert()
  beforeInsert() {
    this.collectionAddress = Web3.utils.toChecksumAddress(
      this.collectionAddress
    );
    this.ownerAddress = Web3.utils.toChecksumAddress(this.ownerAddress);
    if (this.tokenId.startsWith("0x")) {
      this.tokenId = Web3.utils.hexToNumber(this.tokenId).toString();
    }
  }
}
