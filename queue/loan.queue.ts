import Queue from "bull";
import { QUEUE_NAMES } from "../common/constant";
import { bullRedisOptions } from "../configs/redis";

const loanQueue = new Queue(QUEUE_NAMES.LOAN, bullRedisOptions);

export default loanQueue;
