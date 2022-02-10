import { PrismaClient } from "@prisma/client"
import { authorsIndex, comicsIndex, genresIndex } from "../src/modules/Meilisearch"

async function main() {

    const client = await new PrismaClient();


    console.log(`begin fetching`);


    const comicsDatas = await client.comic.findMany({
        include: {
            genres: true,
            author: true,
        }
    })



    const genresData = await client.genre.findMany()
    const authorsData = await client.author.findMany()


    console.log(`begin transforming`);

    interface Named {
        name: string;
    }

    const nameExtractor = <T extends Named>(e: T) => e.name;

    const comicTransformers = comicsDatas.map(e => ({
        ...e,
        genres: e.genres.map(nameExtractor),
        author: e.author.name,
    }))

    console.log(`finish transforming`);

    console.log(`begin index insertion`);


    await comicsIndex.addDocuments(comicTransformers);
    await genresIndex.addDocuments(genresData);
    await authorsIndex.addDocuments(authorsData);


    console.log(`finish index insertion`);

}


main()