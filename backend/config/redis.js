const { createClient } = require("redis");
const chalk = require("chalk").default;

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
});

redisClient.on("error", (err) => {
  console.error( chalk.red.bold("Redis error:", err.message));
});

async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }

  console.log(chalk.green.bold("Redis connected"));
}

module.exports = { redisClient, connectRedis };