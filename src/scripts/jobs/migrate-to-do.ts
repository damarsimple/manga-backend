import sharp from 'sharp';
import { prisma } from '../../modules/Context';
import { DOSpaces } from '../../modules/DOSpaces';


const compress = async (e: Buffer) => {
    return await sharp(e).webp({
        quality: 80
    }).toBuffer()
}


const main = async () => {
    const t = new DOSpaces()




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

        const length = chapters.length;

        let index = 0;


        for (const chapter of chapters) {

            try {

                const innerStart = new Date().getTime()


                for (const img of chapter.imageUrls) {
                    await t.downloadAndUpload(
                        img.replace("https://cdn.gudangkomik.com/", "https://gudangkomik.b-cdn.net/"),
                        img.replace("https://cdn.gudangkomik.com/", ""),
                        compress
                    )
                }

                await prisma.chapter.update({
                    where: {
                        id: chapter.id
                    }, data: {
                        processed: true
                    }
                })

                const innerDiff = new Date().getTime() - innerStart;


                console.log(`[${index}/${length}] Processed ${chapter.name} time ${innerDiff}`)

            } catch (error) {
                console.log(error);

            }

        }

    }

    const diff = new Date().getTime() - start;


    console.log(`migrate-to-do finish at${diff}`);
}

main()