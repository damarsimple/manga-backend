import { prisma } from "./modules/Context";
import axios from "axios";
import BunnyCDN from "./modules/BunnyCDN";
import { writeFile } from "node:fs";
import { Agent } from "node:https";
import Manhwaindo from "./scrappers/manhwaindo";
import { JSDOM } from 'jsdom';
import { slugify } from "./modules/Helper";
import Manhwaland from "./scrappers/manhwaland";
async function main() {

  const manhwaland = new Manhwaland()

  let dom =  new JSDOM( await (await axios.get("https://manhwaland.mom/cheer-up-namjoo-chapter-20/")).data).window.document


  const href =
    dom
      ?.querySelector("link[rel='alternate'][type='application/json']")
      ?.getAttribute("href") ?? "";

  const jsonHtml = await (await axios.get(href)).data;

  // dom = new JSDOM(`
  // <h1>${jsonHtml.title.rendered}</h1>
  // ${jsonHtml.content.rendered}`).window.document;

  console.log(dom)

  const d = await manhwaland.parseChapter(
   dom
  )
  

  console.log(d)

  console.log(
    await (await manhwaland.downloadsImages(

      d.images.map((e, i: number) => {
        return {
          path: manhwaland.createImagePath(
            "test",
            0,
            i,
            manhwaland.extExtractor(e)
          ),
          url: e,
        };
      })

    )).map(e => `https://cdn3.gudangkomik.com${e}`)
  )

}

main();
