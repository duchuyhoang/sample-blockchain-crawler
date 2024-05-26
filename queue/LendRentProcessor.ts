import { EntityManager } from "typeorm";
import QueueLog from "../entities/QueueLog";
import Processor from "./base/Processor";
import { QUEUE_NAMES } from "../common/constant";
import LendRentService from "../service/lentRent";
import QueueManagement from ".";
import { LendRentQueueLogData } from "../fetcher/LendRentCrawler";
import Bull from "bull";
import { CRAWL_EVENT } from "../common/enum";

type LendRentJob = Bull.Job<LendRentQueueLogData>;

class LendRentProcessor extends Processor {
  private lendRentService: LendRentService;
  constructor() {
    super(QUEUE_NAMES.LEND_RENT);
    this.lendRentService = new LendRentService();
    this.setConcurrency(1);
  }
  protected async handleUnfinishedOrFailedTask(
    manager: EntityManager,
    listTasks: QueueLog[]
  ): Promise<void> {
    listTasks.forEach(async (queueLog: QueueLog) => {
      try {
        this.queueInstance.add(queueLog, {
          removeOnComplete: true,
        });
      } catch (e) {
        // Retry at 30s
        await QueueManagement.handleFailedQueueLog(queueLog);
      }
    });
  }
  protected async prepare(): Promise<void> {
    this.queueInstance.process(
      this.getConcurrency() || 1,
      async (job: LendRentJob, done) => {
        const { data } = job.data;
        const { event } = data;
        const lendRentService = new LendRentService();
        try {
          switch (event) {
            case CRAWL_EVENT.LENT:
              const [rs, error] = await lendRentService.handleLentEvent(
                job.data
              );
              if (error) {
                await QueueManagement.handleFailedQueueLog(job.data as any);
                done(error as any, null);
              } else {
                done(null, rs);
              }
              break;
            case CRAWL_EVENT.RENT:
              const [_rs, _error] = await lendRentService.handleRentEvent(
                job.data
              );
              if (_error) {
                await QueueManagement.handleFailedQueueLog(job.data as any);
                done(_error as any, null);
              } else {
                done(null, _rs);
              }
              break;

            case CRAWL_EVENT.STOP_LENDING:
              const [stopLendingRs, stopLendingError] =
                await lendRentService.handleStopLending(job.data);

              if (stopLendingError) {
                await QueueManagement.handleFailedQueueLog(job.data as any);
                done(stopLendingError as any, null);
              } else {
                done(null, stopLendingRs);
              }
              break;

            default:
              done(null, { message: `Not exist event ${event}` });
          }
        } catch (e: any) {
          done(e, null);
          await QueueManagement.handleFailedQueueLog(job.data as any);
        }
      }
    );
  }
}

export default LendRentProcessor;
