import { GraphQLClient, gql } from 'graphql-request';
import { exit } from 'process';
import { prisma } from './modules/Context';
import { APP_ENDPOINT } from './modules/Env';
import { SECRET_KEY } from './modules/Key';

const client = new GraphQLClient(APP_ENDPOINT, {
    headers: {
        authorization: SECRET_KEY
    }
})



const sanityCheck = gql`
query Query($where: ChapterWhereInput) {
  findManyChapterCount(where: $where)
}
`

async function main() {


    // const count = await prisma.chapter.count({
    //     where: {
    //         processed: false
    //     }
    // })

    const section = Math.floor(301115 / 10);

    let hasMore = false

    let batch = 0;

    do {

        const chapters =
            await prisma.chapter.findMany({
                where: {
                    processed: false
                },
                take: section,
                skip: batch * section
            })

        hasMore = chapters.length > 0;

        const ids = chapters.map(c => c.id)

        await prisma.chapter.updateMany({
            where: {
                id: {
                    in: ids
                }
            },
            data: {
                batchs: {
                    set: `${batch}`
                }
            }
        })


        console.log(`Updated Batch ${batch} of total ${batch * section}/301115`)

        batch++;


    } while (hasMore)



}

main()