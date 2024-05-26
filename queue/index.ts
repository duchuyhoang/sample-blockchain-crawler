import { QUEUE_NAMES } from "../common/constant";
import { QueueStatus } from "../common/enum";
import Queue from "bull";
import { bullRedisOptions } from "../configs/redis";
import { queueLogRepository } from "../repository";
import { dateInMiliseconds } from "../common/utils";
import QueueLog from "../entities/QueueLog";
import { BaseIntervalWorker } from "../fetcher/base/BaseIntervalWorker";
import { EntityManager } from "typeorm";
import dataSource from "../configs/dataSource";

export type QueueName = ValueOf<typeof QUEUE_NAMES>;

class QueueManagement {
  public static queueList: Map<QueueName, Queue.Queue> = new Map();
  constructor() {}

  public register(queueName: QueueName, queueInstance: Queue.Queue) {
    queueInstance
      .on("completed", async (job) => {
        const { id } = job.data;
        try {
          await this.updateStatus(id, QueueStatus.COMPLETE);
        } catch (e) {
          console.log(`Failed to update status for ${job.name}`);
        }
      })
      .on("failed", async (job) => {
        const { id } = job.data;
        try {
          console.log("fdffff");
          await this.updateStatus(id, QueueStatus.FAILED);
        } catch (e) {
          console.log(`Failed to update status for ${job.name}`);
        }
      });
    QueueManagement.queueList.set(queueName, queueInstance);
  }

  public static get(queueName: QueueName) {
    return QueueManagement.queueList.get(queueName);
  }

  public handleGetAllUnfinishedTask(queueName: QueueName, limit: number) {
    return queueLogRepository
      .createQueryBuilder("queue_logs")
      .orderBy("retry_at", "ASC")
      .where(
        "queue_name = :queue_name AND try_num < 3 AND retry_at < :now AND status <> :status",
        {
          now: dateInMiliseconds(),
          status: QueueStatus.COMPLETE,
          queue_name: queueName,
        }
      )
      .limit(limit)
      .getMany();
  }

  private updateStatus(queueLogId: string, status: QueueStatus) {
    queueLogRepository
      .createQueryBuilder("queue_logs")
      .update(QueueLog)
      .set({
        status,
      })
      .where("id = :queue_log_id", {
        queue_log_id: queueLogId,
      })
      .execute();
  }

  public async insertQueueLog<D>(queueName: QueueName, data: D) {
    return dataSource.transaction((manager: EntityManager) => {
      const queueLog = new QueueLog();
      queueLog.status = QueueStatus.WAITING;
      queueLog.queueName = queueName;
      queueLog.tryNum = 0;
      queueLog.retryAt = dateInMiliseconds();
      queueLog.data = data;
      return manager
        .createQueryBuilder()
        .insert()
        .into(QueueLog)
        .values(queueLog)
        .execute();
    });
  }

  public static async handleFailedQueueLog(queueLog: QueueLog) {
    return dataSource.transaction(async (manager: EntityManager) => {
      if (queueLog.tryNum < 3) {
        queueLog.retryAt =
          parseInt((queueLog.retryAt || dateInMiliseconds()).toString()) +
          30000;
        queueLog.tryNum = queueLog.tryNum + 1;
        queueLog.status = QueueStatus.FAILED;
      } else {
        queueLog.retryAt = null;
        queueLog.status = QueueStatus.FAILED;
      }
      await manager.getRepository(QueueLog).save(queueLog);
    });
  }
}

export const queueManagement = new QueueManagement();

export default QueueManagement;
