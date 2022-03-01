import { Comic } from "@prisma/client";
import { gql, GraphQLClient } from "graphql-request";
import sharp from "sharp";
import { prisma } from "./modules/Context"
import { DOSpaces } from "./modules/DOSpaces";
import { APP_ENDPOINT } from "./modules/Env";




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


const sanityEclipse = gql`
query Query {
  findManyComic {
    id
    name
    slug
    thumb
    thumbWide
  }
}
`
const client = new GraphQLClient(APP_ENDPOINT, {
    headers: {
        // authorization: SECRET_KEY
    }
})

async function main() {


    const { findManyComic } = await client.request<{
        findManyComic: Comic[]
    }>(sanityEclipse)

    const comics = findManyComic

    const spaces = new DOSpaces()

    let idx = 0;

    const length = comics.length

    const notFound = [];

    for (const comic of comics) {
        try {
            if (comic.thumb)
                await spaces.downloadAndUpload(comic.thumb, comic.thumb.replace("https://cdn.gudangkomik.com", ""), compress)

            if (comic.thumbWide)
                await spaces.downloadAndUpload(comic.thumbWide, comic.thumbWide.replace("https://cdn.gudangkomik.com", ""), compress)



            console.log(`${idx}/${length} processed ${comic.slug} ${comic.thumb} ${comic.thumbWide}`)
        } catch (error: any) {
            console.log(error.response.status == 404 ? "404" : error.response.status)
            notFound.push(comic.slug)
        }

        idx++;

    }

}

main()