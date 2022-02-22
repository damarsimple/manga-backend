import IORedis from 'ioredis';

export const connection = new IORedis({
    port: 6379,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,

});