import { uniq } from "lodash";
import { Chapter, ChapterCandidate, Comic } from "./types";
import { Scrapper } from "./scrapper";
import { slugify } from "../../modules/Helper";

export default class Komicast extends Scrapper {
  public getPageRangeUrl(x: number): string[] {
    const rets = [];

    for (let index = 1; index <= x; index++) {
      rets.push(
        `https://komikcast.me/daftar-komik/page/${index}/?sortby=update`
      );
    }

    return rets;
  }
  public getDeclaration() {
    return {
      name: "Komikcast",
      url: ["https://komikcast.me/", "https://komikcast.me/daftar-komik/?list"],
    };
  }
  public getUpdates(): string[] {
    const links = new Set<string>();
    document.querySelectorAll("a").forEach((e) => {
      const link = e.getAttribute("href");
      if (link && link.includes("https://komikcast.me/komik/")) {
        links.add(link);
      }
    });

    const values = Array.from(links);
    return values;
  }
  public parseComic(doc: Document): Comic {
    const title = doc
      ?.querySelector("h1")
      ?.textContent?.replace(" Bahasa Indonesia", "")
      ?.trim();
    const thumb =
      doc
        ?.querySelector(".komik_info-content-thumbnail-image ,wp-post-image")
        ?.getAttribute("src") ?? "";
    const alt_title = doc
      ?.querySelector(".komik_info-content-native")
      ?.textContent?.split(",");
    const genres = Array.from(
      doc?.querySelector(".komik_info-content-genre")?.querySelectorAll("a") ??
        []
    ).map((e) => e.textContent ?? "");
    const spans = Array.from(
      doc
        ?.querySelector(".komik_info-content-meta")
        ?.querySelectorAll("span") ?? []
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
    let hqChapters: ChapterCandidate[] = [];

    for (const e of Array.from(doc?.querySelectorAll("a")) ?? []) {
      const href = e.getAttribute("href");
      if (!href) continue;

      if (!href.includes("https://komikcast.me/chapter/")) continue;

      const text = e.textContent ?? "";
      const name = this.chapterGuesser(text);

      if (text.includes("HQ"))
        hqChapters.push({
          name,
          href,
        });
    }

    let hqChaptersStringMap: number[] = hqChapters.map((e) => e.name);

    if (hqChaptersStringMap.length > 0) {
      console.log(`found ${hqChaptersStringMap.length} HQ Chapter ${title}`);
    }

    for (const e of Array.from(doc?.querySelectorAll("a")) ?? []) {
      const href = e.getAttribute("href");
      if (!href) continue;
      if (!href.includes("https://komikcast.me/chapter/")) continue;

      const text = e.textContent ?? "";
      const name = this.chapterGuesser(text);

      if (!hqChaptersStringMap.includes(name))
        chapters.push({
          name,
          href,
        });
    }

    chapters = uniq([...chapters, ...hqChapters]);

    if (!title) {
      throw new Error("title not found");
    }

    const comic: Comic = {
      ...(info as unknown as Comic),
      name: title,
      alt_name: alt_title ?? [],
      description:
        doc?.querySelector(".komik_info-description-sinopsis")?.textContent ??
        "",
      genres: genres ?? [],
      chapters,
      slug: slugify(title),
    };

    return comic;
  }
  public parseChapter(doc: Document): Chapter {
    const imgDom = Array.from(
      doc?.querySelector(".main-reading-area")?.querySelectorAll("img") ?? []
    );

    const images = Array.from(imgDom.map((e) => e.getAttribute("src") ?? ""));

    const title = doc?.querySelector("h1")?.textContent ?? "";

    const name = this.chapterGuesser(title);

    return {
      name,
      image_count: images.length,
      original_image_count: images.length,
      images,
      processed: true,
      quality: this.checkQuality(title),
    };
  }
  constructor() {
    super();
  }
}
