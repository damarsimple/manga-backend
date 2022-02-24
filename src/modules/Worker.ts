

import { Worker, Job } from 'bullmq';
import { prisma } from './Context';
import { connection } from './Redis';

const comicWorker = new Worker<{ id: string }>('comic increment', async (job: Job) => {

    await connection.lpush(`comic-views`, job.data.id)

    // await updateDocumentIndex(job.data.id, "comics", update)

    return true;

}, {
    concurrency: 10,
    connection
})


const chapterWorker = new Worker<{ id: string }>('chapter increment', async (job: Job) => {

    await connection.lpush(`chapter-views`, job.data.id)

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
