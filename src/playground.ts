import { comicsIndex } from "./modules/Meilisearch"

async function main() {




    const d = await (await comicsIndex.search("", {
        filter: "id = 2981"
    })).hits[0]

    console.log(d)


    await comicsIndex.addDocuments([d])
}

main()