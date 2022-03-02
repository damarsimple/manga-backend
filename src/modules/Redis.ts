import IORedis from 'ioredis';

export const connection = new IORedis({
    port: 6379,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
});

export const resetComicSets = async () => {

    const keys = await connection.smembers("COMIC_FINDMANY");

    for (const key of keys) {
        await connection.del(key as unknown as string)
    }

    await connection.del("COMIC_FINDMANY");
}