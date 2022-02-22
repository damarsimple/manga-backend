import { SandboxedJob } from "bullmq"
import { gql, GraphQLClient } from "graphql-request"
import sharp from "sharp"
import { DOSpaces } from "../../modules/DOSpaces"
import { APP_ENDPOINT } from "../../modules/Env"
import { SECRET_KEY } from "../../modules/Key"

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


const t = new DOSpaces()


const client = new GraphQLClient(APP_ENDPOINT, {
    headers: {
        authorization: SECRET_KEY
    }
})

module.exports = async (job: SandboxedJob) => {

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
}