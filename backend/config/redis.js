const { createClient } = require("redis");

const redisUrl = process.env.REDIS_URL;
const redisClient = redisUrl
  ? createClient({ url: redisUrl })
  : {
      get: async () => null,
      set: async () => false,
      del: async () => false,
    };

if (redisUrl) {
  redisClient.on("error", (err) => {
    console.error("Redis error:", err.message);
  });
}

async function connectRedis() {
  if (!process.env.REDIS_URL) {
    console.log("Redis URL is not configured; continuing without Redis");
    return;
  }

  if (!redisClient.isOpen) {
    await redisClient.connect();
  }

  console.log("Redis connected");
}

module.exports = { redisClient, connectRedis };