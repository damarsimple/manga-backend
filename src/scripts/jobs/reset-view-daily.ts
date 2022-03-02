import { prisma } from '../../modules/Context';
import { parentPort } from "worker_threads";
if (parentPort) parentPort.postMessage('done');
else process.exit(0);

const main = async () => {

    await prisma.comic.updateMany({
        data: {
            viewsDaily: 0
        }
    })

    console.log(`reset viewsWeek ${(new Date).toISOString()}`);
}

main()