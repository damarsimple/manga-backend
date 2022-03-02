import { Comic } from "@prisma/client";
import { mapLimit } from "async";
import { gql, GraphQLClient } from "graphql-request";
import sharp from "sharp";
import { prisma } from "./modules/Context"
import { DOSpaces } from "./modules/DOSpaces";
import { APP_ENDPOINT } from "./modules/Env";
import { readFileSync } from 'fs';
import { slugify } from "./modules/Helper";




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
mutation UpdateOneComic($data: ComicUpdateInput!, $where: ComicWhereUniqueInput!) {
  updateOneComic(data: $data, where: $where) {
    id 
    name
    thumb
  }
}
`
const client = new GraphQLClient(APP_ENDPOINT, {
    headers: {
        // authorization: SECRET_KEY
    }
})

async function main() {

    const { findManyComic } = await client.request<{ findManyComic: Comic[] }>(gql`
    query Query {
  findManyComic {
    id
    name
    slug
    type
  }
}
    `)

    function capitalizeFirstLetter(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const comics = findManyComic.map((e) => ({
        ...e,
        type: capitalizeFirstLetter(e.type.trim().toLowerCase())
    }))

    const maps = new Map<string, number[]>();

    const remaps: Record<string, string> = {
        'Suzumoto kou': "Manga",
        "Manhw": "Manhwa",
        "N\\a": "N/A",
        "N/a": "N/A",
        "Mn": "Manhua",
        "Updating": "Manhwa",
        "Manhwa, one-shot": "Manhwa",
        "Oel": "Manhwa",
        "Manga, one-shot": "Manga",
        "": "N/A",
        "Unkown": "N/A",
        "One-shot": "Oneshot",
        ",": "N/A",
        "Novel": "N/A"

    }

    for (const comic of comics) {

        const type = remaps[comic.type] || comic.type;


        if (!maps.has(type)) {
            maps.set(type, [comic.id])
        }


        const map = maps.get(type);

        if (map) {

            !map.includes(comic.id) && map.push(comic.id)
        }


    }

    console.log(maps.keys());

    for (const [key, value] of maps.entries()) {
        console.log(`${key} has ${value.length}`)

        console.log(await client.request(gql`
        mutation Mutation($data: ComicUpdateManyMutationInput!, $where: ComicWhereInput) {
  updateManyComic(data: $data, where: $where) {
    count
  }
}
        `, {
            "data": {
                "type": {
                    "set": key
                }
            },
            "where": {
                "id": {
                    "in": value
                }
            }
        }))
    }


}

main()