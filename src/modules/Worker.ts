

import { Worker, Job } from 'bullmq';
import { prisma } from './Context';
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

    await updateDocumentIndex(job.data.id, "comics", update)

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




console.log('worker starting .....');
