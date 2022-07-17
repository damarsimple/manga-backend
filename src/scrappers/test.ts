import { JSDOM } from "jsdom";
import { prisma } from "../modules/Context";
import { gkInteractor } from "../modules/gkInteractor";
import Manhwaland from "./manhwaland";

async function main() {
 
  const manhwaland = new Manhwaland();

  const comic = await manhwaland.parseComic(
    new JSDOM(await manhwaland.axios.get(`https://manhwaland.mom/series/swinging/`).then((e) => e.data)).window
      .document
  );

  const { chapterscandidate, status, chaptersList } =
    await gkInteractor.sanityCheck(comic, comic.chapters);
  
  console.log(chapterscandidate);
  console.log(status);
  console.log(chaptersList);


  console.log(await prisma.comic.findFirst({

    where: {
      slug: comic.slug
    }
  }))

}

main().then(() => console.log("finished"));
