import { resetComicSets } from "../modules/Redis"

async function main() {

    await resetComicSets();

    console.log("done");

}


main()