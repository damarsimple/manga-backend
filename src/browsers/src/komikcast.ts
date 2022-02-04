import { uniq } from "lodash";
import { Chapter, ChapterCandidate, Comic } from "./types";
import { Scrapper } from "./scrapper";
import { slugify } from "../../modules/Helper";


export default class Komicast extends Scrapper {
  public getDeclaration() {
    return {
      name: "Komikcast",
      url: ["https://komikcast.com/", "https://komikcast.com/daftar-komik/?list"]
    };
  }
  public getUpdates(): string[] {
    const links = new Set<string>();
    document.querySelectorAll("a").forEach((e) => {
      const link = e.getAttribute("href");
      if (link && link.includes("https://komikcast.com/komik/")) {
        links.add(link);
      }
    });

    const values = Array.from(links);
    return values;
  }
  public parseComic(doc: Document): Comic {
    const title = doc?.querySelector("h1")?.textContent?.replace(" Bahasa Indonesia", "")?.trim();
    const thumb = doc?.querySelector(".komik_info-content-thumbnail-image ,wp-post-image")?.getAttribute("src") ?? "";
    const alt_title = doc?.querySelector(".komik_info-content-native")?.textContent?.split(",");
    const genres = Array.from(
      doc?.querySelector(".komik_info-content-genre")?.querySelectorAll("a") ?? []
    ).map((e) => e.textContent ?? "");
    const spans = Array.from(
      doc?.querySelector(".komik_info-content-meta")?.querySelectorAll("span") ?? []
    );
    const info = spans.reduce((e, c) => {
      const text = c?.textContent?.split(":");

      if (!text) return e;

      return {
        ...e,
        thumb,
        [text[0].trim().toLowerCase()]: text[1].trim(),
      };
    }, {} as Record<string, string>);

    let chapters: ChapterCandidate[] = [];

    const HQChapter: ChapterCandidate[] = [];


    const HQStrings = HQChapter.map((e) => e.name);

    if (HQStrings.length > 0)
      this._logger.info(`HQ ${title} detected ${HQStrings.length}`);


    for (const e of doc?.querySelectorAll("a") ?? []) {

      const href = e.getAttribute("href");


      if (!href) continue;

      if (!href.includes("https://komikcast.com/chapter/")) continue;

      const name = parseFloat(e?.textContent?.replace("Chapter", "") ?? "");

      if (HQStrings.includes(`${name}`)) {
        HQChapter.push({
          //@ts-ignore
          name,
          href,
        });
      } else {
        chapters.push({
          //@ts-ignore
          name,
          href,
        });
      }
    }


    chapters = uniq([...chapters, ...HQChapter]);

    if (!title) {
      throw new Error("title not found");
    }



    const comic: Comic = {
      ...(info as unknown as Comic),
      name: title,
      alt_name: alt_title ?? [],
      description: doc?.querySelector(".komik_info-description-sinopsis")?.textContent ?? "",
      genres: genres ?? [],
      chapters,
      slug: slugify(title),
    };



    return comic;
  }
  public parseChapter(doc: Document): Chapter {


    const imgDom = Array.from(doc?.querySelector(".main-reading-area")?.querySelectorAll("img") ?? []);

    const images = Array.from(imgDom.map((e) => e.getAttribute("src") ?? ""));

    const title = doc?.querySelector("h1")?.textContent ?? "";

    const name = this.chapterGuesser(title);


    return {
      name,
      image_count: images.length,
      original_image_count: images.length,
      images,
      processed: true,
      quality: this.checkQuality(title)
    }

  }
  constructor() {
    super();
  }
}
