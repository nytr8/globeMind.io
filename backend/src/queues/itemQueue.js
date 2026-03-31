import { Queue } from "bullmq";
import redisConnection from "../config/redisConnection.js";

export const itemQueue = new Queue("item-queue", {
  connection: redisConnection,
});
