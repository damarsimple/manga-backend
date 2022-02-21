

import { Chapter } from '@prisma/client';
import { Worker, Job } from 'bullmq';
import sharp from 'sharp';
import { prisma } from './Context';
import { DOSpaces } from './DOSpaces';
import { updateDocumentIndex } from './Meilisearch';
import { connection } from './Redis';

const comicWorker = new Worker<{ id: string }>('comic increment', async (job: Job) => {

    const update = await prisma.comic.update({
        where: {
            id: job.data.id
        },
        data: {
            views: {
                increment: 1
            },
            viewsWeek: {
                increment: 1
            }
        }
    })

    // await updateDocumentIndex(job.data.id, "comics", update)

    return true;

}, {
    concurrency: 10,
    connection
})


const chapterWorker = new Worker<{ id: string }>('chapter increment', async (job: Job) => {

    await prisma.chapter.update({
        where: {
            id: job.data.id
        },
        data: {
            views: {
                increment: 1
            },
        }
    })

    return true;

}, {
    concurrency: 10,
    connection
})


comicWorker.on('completed', (job: Job, returnvalue: any) => {
    console.log(`job finished increment comic ${job.data.id}`);
});

chapterWorker.on('completed', (job: Job, returnvalue: any) => {
    console.log(`job finished increment chapter ${job.data.id}`);
});

const compress = async (e: Buffer) => {
    return await sharp(e).webp({
        quality: 80
    }).toBuffer()
}

const t = new DOSpaces()



const chapterMigrationWorker = new Worker<{ chapter: Chapter }>('chapter migration', async (job: Job) => {

    const innerStart = new Date().getTime()

    const chapter = job.data.chapter;



    for (const img of chapter.imageUrls) {
        await t.downloadAndUpload(
            img.replace("https://cdn.gudangkomik.com/", "https://gudangkomik.b-cdn.net/"),
            img.replace("https://cdn.gudangkomik.com/", ""),
            compress
        )
    }

    await prisma.chapter.update({
        where: {
            id: chapter.id
        }, data: {
            processed: true
        }
    })

    const innerDiff = new Date().getTime() - innerStart;

    console.log(`Processed ${chapter.name} time ${innerDiff}`)


    return chapter;

}, {
    concurrency: 20,
    connection
})

chapterMigrationWorker.on('completed', (job: Job, returnvalue: Chapter) => {
    console.log(`job finished migration chapter ${returnvalue.name}`);
});


console.log('worker starting .....');
