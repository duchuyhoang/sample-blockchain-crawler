import { Queue } from "bull";
import { EntityManager } from "typeorm";
import QueueManagement from "..";
import { QUEUE_NAMES } from "../../common/constant";
import { QueueStatus } from "../../common/enum";
import { dateInMiliseconds } from "../../common/utils";
import dataSource from "../../configs/dataSource";
import QueueLog from "../../entities/QueueLog";
import { BaseIntervalWorker } from "../../fetcher/base/BaseIntervalWorker";
import { queueLogRepository } from "../../repository";

interface IProcessor {
  concurrency?: number;
  queue_name: string;
}

abstract class Processor extends BaseIntervalWorker {
  protected queueInstance: Queue;
  protected concurrency: number = 1;
  constructor(private queueName: QueueName) {
    super();
    this.queueInstance = QueueManagement.get(this.queueName)!;
  }

  public setConcurrency(value: number) {
    this.concurrency = value;
  }

  public getConcurrency() {
    return this.concurrency;
  }

  protected abstract handleUnfinishedOrFailedTask(
    manager: EntityManager,
    listTask: Array<QueueLog>
  ): Promise<void>;

  protected async doProcess(): Promise<void> {
    dataSource.transaction(async (manager: EntityManager) => {
      const listQueueLogs = await manager
        .getRepository(QueueLog)
        .createQueryBuilder("queue_logs")
        .orderBy("retry_at", "ASC")
        .where(
          "queue_name = :queue_name AND try_num < 3 AND retry_at < :now AND retry_at IS NOT NULL AND status <> :status",
          {
            now: dateInMiliseconds(),
            status: QueueStatus.COMPLETE,
            queue_name: this.queueName,
          }
        )
        .take(this.getConcurrency())
        .getMany();
      // console.log("total task", listQueueLogs.length);

      await this.handleUnfinishedOrFailedTask(manager, listQueueLogs);
    });
  }
}

export default Processor;
