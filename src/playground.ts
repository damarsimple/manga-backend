import { Comic } from "@prisma/client";
import { mapLimit } from "async";
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

    const spaces = new DOSpaces({
        log: true
    })

    // let idx = 0;

    // const length = comics.length

    // const notFound: string[] = [];

    // await mapLimit(comics, 30, async (comic, d) => {
    //     try {
    //         if (comic.thumb)
    //             await spaces.downloadAndUpload(comic.thumb.replace("https://cdn.gudangkomik.com", "https://backupcdn.gudangkomik.com"), comic.thumb.replace("https://cdn.gudangkomik.com", ""), compress)

    //         if (comic.thumbWide)
    //             await spaces.downloadAndUpload(comic.thumbWide.replace("https://cdn.gudangkomik.com", "https://backupcdn.gudangkomik.com"), comic.thumbWide.replace("https://cdn.gudangkomik.com", ""), compress)



    //         console.log(`${idx}/${length} processed ${comic.slug} ${comic.thumb} ${comic.thumbWide}`)
    //     } catch (error: any) {
    //         notFound.push(comic.slug)
    //     }

    //     idx++;
    // })

    // console.log(notFound)

    const x = [
        {
            slug: "gyakkou-shita-akuyaku-reijou-wa-naze-ka-maryoku-wo-ushinattanode-shinsou-no-reijou-ni-narimasu",
            thumb: "https://i2.wp.com/badut.towewew.xyz/uploads/2021/07/Komik-Gyakkou-Shita-Akuyaku-Reijou-wa-Naze-ka-Maryoku-wo-Ushinattanode-Shinsou-no-Reijou-ni-Narimasu.jpg?resize=214,315"
        },
        {
            slug: "jiandao-lingtian",
            thumb: "https://thumbnail.komiku.id/wp-content/uploads/2020/06/Manhua-Jiandao-Lingtian.jpg?w=225&quality=60"
        }
    ]

    for (const b of x) {
        await spaces.downloadAndUpload(b.thumb, `${b.slug}/thumb.jpg`, compress)
    }

}

main()