import Queue from "bull";
import { QUEUE_NAMES } from "../common/constant";
import { bullRedisOptions } from "../configs/redis";

const lendRentQueue = new Queue(QUEUE_NAMES.LEND_RENT, bullRedisOptions);

export default lendRentQueue;
