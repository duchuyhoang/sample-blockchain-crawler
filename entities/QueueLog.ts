import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import { QueueLogEvent, QueueStatus } from "../common/enum";
import { dateInMiliseconds } from "../common/utils";

@Entity({
  name: "queue_logs",
})
class QueueLog {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "text",
    name: "queue_name",
  })
  queueName: string;

  @Column({
    type: "jsonb",
    name: "data",
    nullable: true,
  })
  data: any;

  @Column({
    type: "text",
    name: "status",
    default: QueueStatus.WAITING,
  })
  status: QueueStatus;

  @Column({
    type: "int",
    name: "try_num",
    default: 0,
  })
  tryNum: number;

  @Column({ name: "retry_at", type: "bigint", nullable: true })
  public retryAt: Maybe<number>;

  @Column({ name: "created_at", type: "bigint" })
  public createdAt: number;

  @Column({ name: "updated_at", type: "bigint" })
  public updatedAt: number;

  @BeforeInsert()
  public updateCreateDates() {
    this.createdAt = dateInMiliseconds();
    this.updatedAt = dateInMiliseconds();
    this.retryAt = dateInMiliseconds();
  }

  @BeforeUpdate()
  public updateUpdateDates() {
    this.updatedAt = dateInMiliseconds();
  }
}
export default QueueLog;
