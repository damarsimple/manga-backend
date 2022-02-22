

import { Chapter } from '@prisma/client';
import { Worker, Job } from 'bullmq';
import { GraphQLClient, gql } from 'graphql-request';
import { join } from 'path';
import sharp from 'sharp';
import { prisma } from './Context';
import { DOSpaces } from './DOSpaces';
import { APP_ENDPOINT } from './Env';
import { SECRET_KEY } from './Key';
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
            },
            viewsDaily: {
                increment: 1
            },
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






// const chapterMigrationWorker = new Worker<{ chapter: Chapter }>('chapter migration', join(__dirname, "../scripts/jobs", "process-chapter-migration.ts"), {
//     lockDuration: 1000 * 60 * 3,
//     lockRenewTime: 1000 * 60 * 1,
//     concurrency: 5,
//     connection
// })

// chapterMigrationWorker.on('completed', (job: Job, returnvalue: Chapter) => {
//     console.log(`job finished migration chapter ${returnvalue.name}`);
// });


console.log('worker starting .....');
