import { GraphQLClient, gql } from 'graphql-request';
import { exit } from 'process';
import { prisma } from './modules/Context';
import { APP_ENDPOINT } from './modules/Env';
import { SECRET_KEY } from './modules/Key';
import axios from 'axios';
import { Comic } from '@prisma/client';
import { writeFileSync } from 'fs';
import { mapLimit } from 'async';

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

    const head = ["id", "name", "thumb", "thumbWide"];


    const { findManyComic } = await client.request<{ findManyComic: Comic[] }>(gql`query Query {
      findManyComic {
        id
        name
        thumb
        thumbWide
      }
    }`)

    const datas = [];


    datas.push(head)

    let idx = 0;

    await mapLimit(findManyComic, 30, async (comic, cb) => {
        const notExists = [];
        for (const x of ["thumb", "thumbWide"]) {
            try {

                //@ts-ignore
                if (!comic[x]) {
                    notExists.push(x)
                } else {
                    const a = await axios.head(
                        //@ts-ignore
                        comic[x]
                    );

                    console.log(`${idx}/${findManyComic?.length} ${comic.id} ${x} ${a.status}`)
                }

            } catch (error) {
                notExists.push(x)
            }
        }


        if (notExists.length > 0) {
            datas.push([comic.id, comic.name, comic.thumb, comic.thumbWide])
        }
        idx++;
    })

    const remaps = datas.map(e => e.join(`\t`))


    writeFileSync(`comic-thumbW-check.tsv`, remaps.join(`\n`))


    // // const count = await prisma.chapter.count({
    // //     where: {
    // //         processed: false
    // //     }
    // // })

    // const section = Math.floor(301115 / 10);

    // let hasMore = false

    // let batch = 0;

    // do {

    //     const chapters =
    //         await prisma.chapter.findMany({
    //             where: {
    //                 processed: false
    //             },
    //             take: section,
    //             skip: batch * section
    //         })

    //     hasMore = chapters.length > 0;

    //     const ids = chapters.map(c => c.id)

    //     await prisma.chapter.updateMany({
    //         where: {
    //             id: {
    //                 in: ids
    //             }
    //         },
    //         data: {
    //             batchs: {
    //                 set: `${batch}`
    //             }
    //         }
    //     })


    //     console.log(`Updated Batch ${batch} of total ${batch * section}/301115`)

    //     batch++;


    // } while (hasMore)



}

main()