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


    const chapters = await prisma.chapter.findMany({
        where: {
            processed: false
        }
    });


    const length = chapters.length;

    let index = 0;

    const start = new Date().getTime()


    for (const chapter of chapters) {

        try {

            const innerStart = new Date().getTime()


            for (const img of chapter.imageUrls) {
                await t.downloadAndUpload(
                    img,
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

    const diff = new Date().getTime() - start;


    console.log(`migrate-to-do finish at${diff}`);
}

main()