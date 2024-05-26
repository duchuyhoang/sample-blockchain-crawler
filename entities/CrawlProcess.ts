import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({
  name: "crawl_process",
})
export default class CrawlProcess {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    name: "contract_name",
    type: "text",
    unique: true,
  })
  contractName: string;

  @Column({
    name: "contract_address",
    type: "text",
    unique: true,
    nullable: false,
  })
  contractAddress: string;

  @Column({
    name: "last_processed_block",
    type: "bigint",
    nullable: false,
    default: 0,
  })
  lastProcessedBlock: number;

  @CreateDateColumn({ name: "created_at" })
  public createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  public updatedAt: Date;
}
