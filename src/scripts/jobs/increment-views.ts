import { prisma } from '../../modules/Context';
import { connection } from '../../modules/Redis';


const main = async () => {

    const comicsIds = await connection.lrange(`comic-views`, 0, -1)

    const remaps = new Map<string, number[]>()

    for (const id of comicsIds) {
        if (!remaps.has(id)) {
            remaps.set(id, [parseInt(id)])
        } else {
            const arr = remaps.get(id);
            arr && arr.push(parseInt(id))
        }
    }

    for (const [id, arr] of remaps) {
        const increment = arr.length
        await prisma.comic.update({
            where: {
                id: parseInt(id)
            },
            data: {
                viewsDaily: {
                    increment
                },
                viewsHourly: {
                    increment
                },
                viewsWeek: {
                    increment
                }
            }
        })
    }


    await connection.del('comic-views')

    const chaptersIds = await connection.lrange(`comic-views`, 0, -1)

    const remapsChap = new Map<string, number[]>()

    for (const id of chaptersIds) {
        if (!remapsChap.has(id)) {
            remapsChap.set(id, [parseInt(id)])
        } else {
            const arr = remapsChap.get(id);
            arr && arr.push(parseInt(id))
        }
    }

    for (const [id, arr] of remapsChap) {
        const increment = arr.length
        await prisma.chapter.update({
            where: {
                id: parseInt(id)
            },
            data: {
                views: {
                    increment
                }
            }
        })
    }


    await connection.del('comic-views')

    console.log(`add views ${(new Date).toISOString()}`);
}

main()