import "dotenv/config";
import { Redis } from "ioredis";
const redisConnection = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
});

redisConnection.on("connect", () => {
  console.log("server is connected to redis");
});
redisConnection.on("error", (err) => {
  console.log(err);
});

export default redisConnection;
