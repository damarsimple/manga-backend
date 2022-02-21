import { prisma } from '../../modules/Context';
import { chapterMigrationQueue } from '../../modules/Queue';
import { gql, GraphQLClient } from "graphql-request";
import { Chapter } from '@prisma/client';
import { APP_ENDPOINT } from '../../modules/Env';
import { SECRET_KEY } from '../../modules/Key';
import sharp from 'sharp';
import { DOSpaces } from '../../modules/DOSpaces';
import { QueueGetters } from 'bullmq';


const sanityEclipse = gql`
query Query($where: ChapterWhereInput, $take: Int, $skip: Int) {
  findManyChapter(where: $where, take: $take, skip: $skip) {
    name
    id
    imageUrls
  }
}
`



const client = new GraphQLClient(APP_ENDPOINT, {
    headers: {
        authorization: SECRET_KEY
    }
})


const t = new DOSpaces()

const main = async () => {




    let index = 0;

    while (true) {
        const start = new Date().getTime()


        const { findManyChapter: chapters } = await client.request<{
            findManyChapter: Chapter[]
        }>(sanityEclipse, {
            "where": {
                "processed": {
                    "equals": false
                },
            },
            "take": 200,
            "skip": 200 * index
        })


        for (const chapter of chapters) {

            try {

                chapterMigrationQueue.add("chapter migration", { chapter })


            } catch (error) {
                console.log(error);

            }

        }


        const diff = new Date().getTime() - start;



        console.log(`migrate-batch-do finish ${index} at${diff}`);

        index++;

        if (chapters.length == 0) break;

    }

}

main()