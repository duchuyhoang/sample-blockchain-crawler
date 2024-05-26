import Queue from "bull";
import { QUEUE_NAMES } from "../common/constant";
import { bullRedisOptions } from "../configs/redis";

const nftQueue = new Queue(QUEUE_NAMES.NFT_QUEUE, bullRedisOptions);

export default nftQueue;
