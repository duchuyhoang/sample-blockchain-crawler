import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  Index,
  Unique,
  ManyToOne,
  BeforeUpdate,
  JoinColumn,
} from "typeorm";
import { LoanStatus, NETWORK } from "../common/enum";
import NFT from "./NFT";
import Web3 from "web3";

@Entity({
  name: "loans",
})
export default class Loans {
  @PrimaryGeneratedColumn("uuid")
  id: number | string;

  @Column({ nullable: false, name: "loan_id" })
  lendingId: string;

  @Column({ nullable: true, name: "network" })
  network: NETWORK;

  @ManyToOne(() => NFT, (nft) => nft.id)
  @JoinColumn({
    name: "nft",
  })
  nft: NFT;

  @Column({ nullable: false, name: "max_rent_duration" })
  maxRentDuration: number;

  // base 16
  @Column({ nullable: false, name: "daily_fee" })
  dailyFee: string;

  // base 16
  @Column({ nullable: false, name: "collateral", type: "float" })
  collateral: string;

  @Column({ nullable: true, name: "latest_price", type: "float" })
  latestPrice: Maybe<string>;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  // in second
  @Column({ nullable: true, name: "start_rent_date", type: "text" })
  startDate: string;

  // in days
  @Column({ nullable: true, name: "rent_duration", type: "integer" })
  rentDuration: Maybe<number>;

  @Column({ nullable: true, name: "total_rent_amount" })
  totalRentAmount: string;

  @Column({ nullable: false, name: "use_native_token" })
  useNativeToken: boolean;

  @Column({ nullable: false, name: "lent_amount", default: 1 })
  lentAmount: number;

  @Column({ nullable: true, name: "lender_address" })
  lenderAddress: string;

  // real owner on the blockchain
  @Column({ nullable: true, name: "renter_address", type: "text" })
  renterAddress: Maybe<string>;

  @Column({ nullable: false, default: LoanStatus.LISTING })
  status: string;

  @BeforeInsert()
  beforeInsert() {
    if (this.lenderAddress)
      this.lenderAddress = Web3.utils.toChecksumAddress(this.lenderAddress);
    if (this.renterAddress)
      this.renterAddress = Web3.utils.toChecksumAddress(this.renterAddress);
  }

  @BeforeUpdate()
  beforeUpdate() {
    if (this.lenderAddress)
      this.lenderAddress = Web3.utils.toChecksumAddress(this.lenderAddress);
    if (this.renterAddress)
      this.renterAddress = Web3.utils.toChecksumAddress(this.renterAddress);
  }
}
