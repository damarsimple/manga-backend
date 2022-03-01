import { prisma } from "./modules/Context"
import { updateDocumentIndex } from "./modules/Meilisearch"
import { comicIncrementQueue } from "./modules/Queue"




async function main() {


    const comic = await prisma.comic.findFirst();

    if (!comic) return;


    const { id } = comic;

    for (let i = 0; i < 10; i++) {
        comicIncrementQueue.add('increment', { id })

        console.log('add job ' + id)
    }

}

main()