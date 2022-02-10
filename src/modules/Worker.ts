

import { Worker, Job } from 'bullmq';
import { prisma } from './Context';
import { updateDocumentIndex } from './Meilisearch';
import { connection } from './Redis';

const worker = new Worker<{ id: string }>('comic increment', async (job: Job) => {

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

worker.on('completed', (job: Job, returnvalue: any) => {
    console.log(`job finished increment ${job.data.id}  ${returnvalue}`);
});

worker.on('active', function () {
    console.log(`job  increment active  `);
})