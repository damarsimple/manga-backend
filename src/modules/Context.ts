import { comicsIndex, genresIndex, authorsIndex } from './Meilisearch';
import { PrismaClient, User } from "@prisma/client"

export interface Context {

    prisma: PrismaClient
    select: any
    gotKey: boolean

    comicsIndex: typeof comicsIndex,
    genresIndex: typeof genresIndex,
    authorsIndex: typeof authorsIndex,

    user?: User,
    isLogged: boolean,
    isAdmin: boolean,

}



export const prisma = new PrismaClient({
    // log: ["query"]
});



export const context = {
    prisma,
    select: {},
    comicsIndex,
    genresIndex,
    authorsIndex,

}
// prisma.$use((params, next) => {
//     const isFindMany = params.action === 'findMany';

//     if (params.model !== "Comic") return next(params);

//     if (!isFindMany) return next(params);

//     const takeParameter = params.args.take;

//     const takeParameterIsUndefined = takeParameter === undefined;

//     if (takeParameterIsUndefined || takeParameter > 30) {
//         params.args.take = 30;
//     }



//     return next(params);
// });