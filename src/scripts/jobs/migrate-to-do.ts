import { prisma } from '../../modules/Context';
import { chapterMigrationQueue } from '../../modules/Queue';
import { gql, GraphQLClient } from "graphql-request";
import { Chapter } from '@prisma/client';
import { APP_ENDPOINT } from '../../modules/Env';
import { SECRET_KEY } from '../../modules/Key';
import sharp from 'sharp';
import { DOSpaces } from '../../modules/DOSpaces';
import { QueueGetters } from 'bullmq';
import { parallelLimit, map, mapLimit } from 'async';

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


const t = new DOSpaces()


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

const { MIGRATION_ORDER } = process.env;

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
        },

    })


    const start = new Date().getTime()

    const times: number[] = [];


    do {


        const { findManyChapter: chapters } = await client.request<{
            findManyChapter: Chapter[]
        }>(sanityEclipse, {
            "where": {
                "processed": {
                    "equals": false
                },
            },
            "take": 500,
            "skip": index * 500,
            "orderBy": [
                {
                    "createdAt": MIGRATION_ORDER
                }
            ]
        })


        console.log(`${index}/${total} start `)

        await mapLimit(chapters, 20, async (chapter, done) => {
            try {
                const innerStart = new Date().getTime()
                for (const img of chapter.imageUrls) {
                    try {
                        await t.downloadAndUpload(
                            img,
                            img.replace("https://cdn.gudangkomik.com/", ""),
                            compress
                        )
                    } catch (error) {

                    }
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

                curIdx++;

                console.log(`${curIdx}/${total} Processed ${chapter.name} time ${innerDiff}`)

                times.push(innerDiff)



            } catch (error) {
                console.log(error);


            }
        });


        hasMore = chapters.length > 0
        index++;

        console.log(`current batch ${index * 500}/${total} avg ${times.reduce((a, b) => a + b, 0) / times.length}`)

    } while (hasMore)


    const diff = new Date().getTime() - start;



    console.log(`migrate-batch-do finish ${index} at${diff}`);

    index++;



}

main()