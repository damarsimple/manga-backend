import { GraphQLClient, gql } from 'graphql-request';
import { exit } from 'process';
import BunnyCDN from './modules/BunnyCDN';
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


    const datas: number[] = []
    const start = new Date().getTime()
    let prev = 0;
    await setInterval(async () => {
        const { findManyChapterCount: data } = await client.request<{
            findManyChapterCount: number
        }>(sanityCheck, {
            "where": {
                "processed": {
                    "equals": true
                }
            }

        })

        datas.push(data - prev);

        prev = data;


        console.log(`count ${data}`);

        if (new Date().getTime() - start > 100000) {
            console.log(datas)
            console.log(`avg ${datas.reduce((a, b) => a + b, 0) / datas.length}/sec`)

            exit()
        }

    }, 1000)





}

main()