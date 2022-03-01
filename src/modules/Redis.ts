import IORedis from 'ioredis';

export const connection = new IORedis({
    port: 6379,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
});

export const resetComicSets = async () => {
    await connection.spop("COMIC_FINDMANY", 1, async (e) => {
        if (!e) return;
        await connection.del(e as unknown as string)
    });
}