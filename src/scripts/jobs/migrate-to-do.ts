import { prisma } from '../../modules/Context';
import { chapterMigrationQueue } from '../../modules/Queue';
import { gql, GraphQLClient } from "graphql-request";
import { Chapter } from '@prisma/client';
import { APP_ENDPOINT } from '../../modules/Env';
import { SECRET_KEY } from '../../modules/Key';
import sharp from 'sharp';
import { parallelLimit, map, mapLimit } from 'async';
import { AxiosError, AxiosResponse } from 'axios';
import BunnyCDN from '../../modules/BunnyCDN';

const sanityEclipse = gql`
query Query($where: ChapterWhereInput, $take: Int, $skip: Int,$orderBy: [ChapterOrderByWithRelationInput]) {
  findManyChapter(where: $where, take: $take, skip: $skip, orderBy:$orderBy) {
    name
    id
    imageUrls
  }
}
`
const getCount = gql`
query Query($where: ChapterWhereInput) {
  findManyChapterCount(where: $where) 
}
`



const client = new GraphQLClient(APP_ENDPOINT, {
    headers: {
        authorization: SECRET_KEY
    }
})


const t = new BunnyCDN({ log: false })


const compress = async (e: Buffer) => {

    try {
        return await sharp(e).webp({
            quality: 80
        }).toBuffer()
    } catch (error) {
        try {
            return await sharp(e).jpeg({
                quality: 80
            }).toBuffer()
        } catch (error) {
            return e
        }
    }
}



const updateChapter = gql`
mutation UpdateOneChapter($data: ChapterUpdateInput!, $where: ChapterWhereUniqueInput!) {
    updateOneChapter(data: $data, where: $where) {
        id
    }
}

`

const { MIGRATION_BATCH } = process.env;

const main = async () => {




    let index = 0;

    let curIdx = 0;
    let hasMore = true;




    const { findManyChapterCount: total } = await client.request<{
        findManyChapterCount: number
    }>(getCount, {
        "where": {
            "processed": {
                "equals": false
            },
            "batchs": {
                "equals": `${MIGRATION_BATCH}`
            }
        },

    })


    const start = new Date().getTime()

    const times: number[] = [];



    const perBatch = 500;

    console.log(`${index}/${total} start migrate batch :  ${MIGRATION_BATCH} total ${total}`)


    do {

        const batchTimer = new Date().getTime();


        const { findManyChapter: chapters } = await client.request<{
            findManyChapter: Chapter[]
        }>(sanityEclipse, {
            "where": {
                "processed": {
                    "equals": false
                },
                "batchs": {
                    "equals": `${MIGRATION_BATCH}`
                }
            },
            "take": perBatch,
            "skip": index * perBatch,

        })

        const notFound: number[] = [];



        await mapLimit(chapters, 30, async (chapter, done) => {
            const innerStart = new Date().getTime()
            let success = true;
            try {
                for (const img of chapter.imageUrls) {
                    await t.downloadAndUpload(
                        img,
                        img.replace("https://cdn.gudangkomik.com", ""),
                        compress
                    )
                }

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





            } catch (error) {
                const y = (error as any).response as AxiosResponse
                if (y?.status == 404) {
                    notFound.push(chapter.id)
                }
                success = false;
            }

            const innerDiff = new Date().getTime() - innerStart;

            curIdx++;

            console.log(`${curIdx}/${perBatch}/${total} ${success ? "Processed" : "Failed"} ${chapter.name} time ${innerDiff} batch ${MIGRATION_BATCH}`)

            times.push(innerDiff)
        });

        for (const id of notFound) {

            await client.request(updateChapter, {
                "data": {
                    "processed": {
                        "set": false
                    },
                    "batchs": {
                        "set": "404"
                    }
                },
                "where": {
                    "id": id
                }
            })

        }

        const diff = new Date().getTime() - batchTimer;

        console.log(`${index}/${total} batch :  ${MIGRATION_BATCH} diff ${diff}`)


        hasMore = chapters.length > 0

        index++;

        console.log(`current batch ${index * perBatch}/${total} avg ${times.reduce((a, b) => a + b, 0) / times.length}`)

    } while (hasMore)


    const diff = new Date().getTime() - start;



    console.log(`migrate-batch-do ${MIGRATION_BATCH} finish ${index} at ${diff}`);

    index++;



}

main()