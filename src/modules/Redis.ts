import IORedis from 'ioredis';

export const connection = new IORedis({
    host: "ssh.damaral.my.id",
    password: "",
    port: 6379,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,

});