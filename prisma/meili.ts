import { prisma } from "../src/modules/Context";
import { authorsIndex, comicsIndex, genresIndex } from "../src/modules/Meilisearch"

async function main() {



    console.log(`begin fetching`);


    const comicsDatas = await prisma.comic.findMany({
        include: {
            genres: true,
            author: true,
        }
    })



    const genresData = await prisma.genre.findMany()
    const authorsData = await prisma.author.findMany()


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