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


    const count = await prisma.chapter.count({
        where: {
            processed: false
        }
    })

    const section = Math.floor(count / 10);

    let hasMore = false

    let batch = 1;

    do {

        const chapters =
            await prisma.chapter.findMany({
                where: {
                    processed: false
                },
                take: section
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
                batchs: `${batch}`
            }
        })

        batch++;

        console.log(`Updated Batch ${batch} of ${section} of total ${chapters.length}`)


    } while (hasMore)



}

main()