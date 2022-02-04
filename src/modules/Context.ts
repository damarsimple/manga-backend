import { PrismaClient } from "@prisma/client"

export interface Context {

    prisma: PrismaClient,
    select: any
    gotKey: boolean
}

const prisma = new PrismaClient({
    // log: ["query"]
});



export const context = {

    prisma,
    select: {}

}