import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  Index,
  Unique,
} from "typeorm";
import Web3 from "web3";

@Entity({
  name: "collection",
})
@Unique(["collectionAddress", "network"])
@Index(["collectionAddress", "network"])
export default class Collection {
  @PrimaryGeneratedColumn("uuid", {
    name: "collection_id",
  })
  collectionId: string;

  @Column({
    name: "collection_address",
    nullable: false,
  })
  collectionAddress: string;

  @Column({
    name: "collection_name",
    nullable: true,
    type: "text",
  })
  collectionName: string | null;

  @Column({ nullable: false, name: "network" })
  network: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @CreateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @BeforeInsert()
  beforeInsert() {
    this.collectionAddress = Web3.utils.toChecksumAddress(
      this.collectionAddress
    );
  }
}
