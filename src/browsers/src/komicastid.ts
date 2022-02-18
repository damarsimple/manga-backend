import { uniq } from "lodash";
import { Chapter, ChapterCandidate, Comic } from "./types";
import { Scrapper } from "./scrapper";
import { slugify } from "../../modules/Helper";


export default class Komicastid extends Scrapper {
  public getPageRangeUrl(x: number): string[] {
    const rets = []

    for (let index = 1; index <= x; index++) {

      rets.push(`https://komikcastid.com/komik-terbaru/page/${index}/`);

    }

    return rets;
  }
  public getDeclaration() {
    return {
      name: "KomikcastID",
      url: ["https://komikcastid.com/komik-terbaru/"],
    };
  }



  public getUpdates(): string[] {
    const links = new Set<string>();
    document.querySelectorAll("a").forEach((e) => {
      const link = e.getAttribute("href");
      if (link && link.includes("https://komikcastid.com/komik/")) {
        links.add(link);
      }
    });

    const values = Array.from(links);
    return values;
  }
  public parseComic(doc: Document): Comic {
    const title = doc?.querySelector("h1")?.textContent?.replace("Komik ", "")?.trim();
    const infos = doc?.querySelector(".spe")?.querySelectorAll("span");
    const thumb = doc?.querySelector(".thumb")?.querySelector("img")?.getAttribute("src") ?? "";
    const alt_title = infos && infos[0]?.textContent?.replace("Judul Alternatif: ", "").split(",");
    const genres = Array.from(
      doc?.querySelector(".genre-info")?.querySelectorAll("a") ?? []
    ).map((e) => e.textContent ?? "");


    const info = Array.from(infos ?? []).reduce((e, c) => {
      const text = c?.textContent?.split(":");

      if (!text) return e;

      return {
        ...e,
        [text[0].trim().toLowerCase()]: text[1].trim(),
      };
    }, {} as Record<string, string>);


    let chapters: ChapterCandidate[] = [];


    doc?.querySelector("#chapter_list")?.querySelector("ul")?.querySelectorAll("li")?.forEach((x) => {

      const e = x.querySelector(".lchx");

      if (!e) return;


      const href = e.querySelector("a")?.getAttribute("href");

      if (!e.textContent || !href) return;

      const name = this.chapterGuesser(e.textContent);

      chapters.push({
        href,
        name,
      });
    });



    chapters = uniq([...chapters]);

    if (!title) {
      throw new Error("title not found");
    }



    const comic: Comic = {
      ...(info as unknown as Comic),
      thumb,
      name: title,
      alt_name: alt_title ?? [],
      description: doc?.querySelector(".kshortcsc, .sht2")?.textContent ?? "",
      genres: genres ?? [],
      chapters,
      slug: slugify(title),
    };



    return comic;
  }
  public parseChapter(doc: Document): Chapter {


    const imgDom = Array.from(doc?.querySelector("#chimg")?.querySelectorAll("img") ?? []);

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
