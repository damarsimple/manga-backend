import { Author, Comic, Genre } from '@prisma/client'
import { Index, MeiliSearch } from 'meilisearch'

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

    await comicsIndex.updateFilterableAttributes(commonFilter)
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

    await indexes.addDocuments([{
        ...d,
        ...data
    }])
}


export const deleteDocumentIndex = async (id: string | number, index: Indexes) => {
    const indexes = client.index(index)



    await indexes.deleteDocument(id)
}

wrap()

