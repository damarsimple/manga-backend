import IORedis from 'ioredis';

export const connection = new IORedis({
    host: "ssh.damaral.my.id",
    maxRetriesPerRequest: null,
    enableReadyCheck: false
});