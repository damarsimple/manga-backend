import { prisma } from '../../modules/Context';


const main = async () => {

    await prisma.comic.updateMany({
        data: {
            viewsWeek: 0
        }
    })

    console.log(`reset viewsWeek ${(new Date).toISOString()}`);
}

main()