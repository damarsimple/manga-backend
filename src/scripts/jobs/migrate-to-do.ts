import { prisma } from '../../modules/Context';
import { chapterMigrationQueue } from '../../modules/Queue';




const main = async () => {




    const start = new Date().getTime()

    let skip = 0;

    while (true) {

        const chapters = await prisma.chapter.findMany({
            where: {
                processed: false
            },
            take: 100,
            skip: 100 * skip
        });

        if (chapters.length == 0) break;

        skip++;



        for (const chapter of chapters) {

            try {

                chapterMigrationQueue.add("chapter migration", { chapter })

            } catch (error) {
                console.log(error);

            }

        }

    }

    const diff = new Date().getTime() - start;


    console.log(`migrate-to-do finish at${diff}`);
}

main()