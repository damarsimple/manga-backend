

import { Chapter } from '@prisma/client';
import { Worker, Job } from 'bullmq';
import { GraphQLClient, gql } from 'graphql-request';
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


const t = new DOSpaces()


const client = new GraphQLClient(APP_ENDPOINT, {
    headers: {
        authorization: SECRET_KEY
    }
})


const updateChapter = gql`
mutation UpdateOneChapter($data: ChapterUpdateInput!, $where: ChapterWhereUniqueInput!) {
    updateOneChapter(data: $data, where: $where) {
        id
    }
}

`

const compress = async (e: Buffer) => {

    try {
        return await sharp(e).webp({
            quality: 80
        }).toBuffer()
    } catch (error) {
        return await sharp(e).jpeg({
            quality: 80
        }).toBuffer()
    }
}



const chapterMigrationWorker = new Worker<{ chapter: Chapter }>('chapter migration', async (job: Job) => {

    const innerStart = new Date().getTime()

    const { chapter } = job.data

    for (const img of chapter.imageUrls) {
        await t.downloadAndUpload(
            img,
            img.replace("https://cdn.gudangkomik.com/", ""),
            compress
        )
    }



    const innerDiff = new Date().getTime() - innerStart;

    await client.request(updateChapter, {
        "data": {
            "processed": {
                "set": true
            }
        },
        "where": {
            "id": chapter.id
        }
    })

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
