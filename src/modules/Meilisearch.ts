import { Author, Comic, Genre } from '@prisma/client'
import { Index, MeiliSearch } from 'meilisearch'
import { connection } from './Redis'

export const client = new MeiliSearch({
    host: 'http://127.0.0.1:7700',
    apiKey: '12345678',
})




export const comicsIndex = client.index('comics')
export const genresIndex = client.index('genres')
export const authorsIndex = client.index('authors')

const commonSort = [
    'createdAt',
    'updatedAt',
];

const commonFilter = [
    "id",
    "slug"
]

const wrap = async () => {

    await comicsIndex.updateFilterableAttributes([
        'isHentai',
        'type',
        ...commonFilter])
    await genresIndex.updateFilterableAttributes(commonFilter)
    await authorsIndex.updateFilterableAttributes(commonFilter)

    await comicsIndex.updateSortableAttributes([
        'views',
        'rating',
        'viewsWeek',
        'lastChapterUpdatedAt',

        ...commonSort
    ])

    await genresIndex.updateSortableAttributes(commonSort)
    await authorsIndex.updateSortableAttributes(commonSort)
}

type Indexes = "authors" | "comics" | "genres";

export const updateDocumentIndex = async <T>(id: string | number, index: Indexes, data: T) => {
    const indexes = client.index(index)

    const d = await (await indexes.search("", {
        filter: `id = ${id}`
    })).hits[0]

    const INDEX_KEY = `${index}_INDEX`

    const length = await connection.llen(INDEX_KEY)
    if (length > 60) {
        console.log(`starting queued indexed ${INDEX_KEY} jobs`)
        const jobs = await connection
            .lrange(INDEX_KEY, 0, -1)

        const jobsData = jobs.map((e) => JSON.parse(e))


        await indexes.addDocuments(jobsData)

        console.log(`finished ${INDEX_KEY} jobs`)

        await connection.del(INDEX_KEY)


    } else {
        console.log(`queueing ${INDEX_KEY} ${length} jobs`)
        await connection.rpush(INDEX_KEY, JSON.stringify({
            ...d,
            ...data
        }))
    }


}


export const deleteDocumentIndex = async (id: string | number, index: Indexes) => {
    const indexes = client.index(index)
    await indexes.deleteDocument(id)
}

wrap()

