const redisPackage = require('redis');
const redis = redisPackage.createClient();
let redisConnected = false;

redis.on('connect', async () => {
  console.log('redis connected');
  redisConnected = true;
});
redis.on('error', err => {
  console.error('Redis Error', err);
})
redis.connect();
