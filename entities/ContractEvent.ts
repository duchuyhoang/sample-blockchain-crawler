import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { dateInMiliseconds } from "../common/utils";

@Entity({
  name: "contract_events",
})
class ContractEvent {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column({
    type: "text",
    nullable: false,
  })
  address: string;

  @Column({
    type: "text",
    name: "block_hash",
    nullable: false,
  })
  blockHash: string;

  @Column({
    type: "bigint",
    name: "block_time",
    nullable: false,
  })
  blockTime: number;

  @Column({
    type: "text",
    name: "tx_hash",
    nullable: false,
  })
  txHash: string;

  @Column({
    type: "bigint",
    name: "tx_index",
    nullable: false,
  })
  txIndex: number;

  @Column({
    type: "bigint",
    name: "event_id",
    nullable: false,
  })
  eventId: number;

  @Column({
    type: "text",
    name: "event",
    nullable: false,
  })
  event: string;

  @Column({
    type: "jsonb",
    name: "return_values",
  })
  returnValues: JSON;

  @CreateDateColumn({
    name: "create_at",
  })
  createAt: Date;
  @UpdateDateColumn({
    name: "update_at",
  })
  updateAt: Date;
}

export default ContractEvent;
