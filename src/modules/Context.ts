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