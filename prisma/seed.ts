import { Prisma, PrismaClient } from "@prisma/client";
import { create } from "../src/modules/Hash";

async function main() {

    const client = new PrismaClient()

 await   client.user.create({
        data: {
            id: 1,
            isAdmin: true,
            email: "damaralbaribin@gmail.com",
            password: await create("123456789"),
        }
    })

}

main()