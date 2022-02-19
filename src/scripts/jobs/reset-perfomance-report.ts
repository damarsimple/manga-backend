import { prisma } from '../../modules/Context';


const main = async () => {

    await prisma.perfomanceAnalytic.deleteMany();

    console.log(`reset perfomanceAnalytic ${(new Date).toISOString()}`);
}

main()