import { prisma } from '../../modules/Context';


const main = async () => {

    await prisma.comic.updateMany({
        data: {
            viewsDaily: 0
        }
    })

    console.log(`reset viewsWeek ${(new Date).toISOString()}`);
}

main()