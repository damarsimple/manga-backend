import { PrismaClient } from '@prisma/client';

const client = new PrismaClient()

const main = async () => {

    await client.comic.updateMany({
        data: {
            viewsWeek: 0
        }
    })

    console.log(`reset viewsWeek ${(new Date).toISOString()}`);
}

main()