import { prisma } from '../../modules/Context';
import { parentPort } from "worker_threads";


const main = async () => {

    await prisma.perfomanceAnalytic.deleteMany();

    console.log(`reset perfomanceAnalytic ${(new Date).toISOString()}`);

    if (parentPort) parentPort.postMessage('done');
    else process.exit(0);
}

main()