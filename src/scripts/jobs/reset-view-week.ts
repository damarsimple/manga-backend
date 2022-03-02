import { prisma } from '../../modules/Context';
import { parentPort } from "worker_threads";


const main = async () => {

    await prisma.comic.updateMany({
        data: {
            viewsWeek: 0
        }
    })

    console.log(`reset viewsWeek ${(new Date).toISOString()}`);

    if (parentPort) parentPort.postMessage('done');
    else process.exit(0);
}

main()