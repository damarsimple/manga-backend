import { uniq } from "lodash";
import { Chapter, ChapterCandidate, Comic } from "./types";
import { Scrapper } from "./scrapper";
import { slugify } from "../../modules/Helper";

// SAME TEMPLATE AS MANHWAINDO

const IGNORE = "imagesimple.co/img/manhwaindo/";

export default class Manhwaindo extends Scrapper {
  public getPageRangeUrl(x: number): string[] {
    const rets = [];

    for (let index = 1; index <= x; index++) {
      rets.push(`https://manhwaindo.id/series/?page=${index}&order=update`);
    }

    return rets;
  }
  public getDeclaration() {
    return {
      name: "Manhwaindo",
      url: [
        "https://manhwaindo.id/",
        "https://manhwaindo.id/series/list-mode/",
      ],
      annoying: true,
    };
  }
  public getUpdates(): string[] {
    const links = new Set<string>();
    document.querySelectorAll("a").forEach((e) => {
      const link = e.getAttribute("href");
      if (
        link &&
        link.includes("https://manhwaindo.id/series/") &&
        link !== "https://manhwaindo.id/series/list-mode/"
      ) {
        links.add(link);
      }
    });

    const values = Array.from(links);
    return values;
  }
  public parseComic(doc: Document): Comic {
    const title = doc
      ?.querySelector("h1")
      ?.textContent?.replace("Komik ", "")
      ?.trim();
    const thumb =
      doc
        ?.querySelector(".thumb")
        ?.querySelector("img")
        ?.getAttribute("src")
        ?.replace(IGNORE, "") ?? "";
    const alt_title = doc
      ?.querySelector("span, .alternative")
      ?.textContent?.split(",");
    const genres = Array.from(
      doc?.querySelector(".mgen")?.querySelectorAll("a") ?? []
    )?.map((e) => e.textContent ?? "");
    const spans = Array.from(
      doc?.querySelector(".bixbox")?.querySelectorAll(".imptdt") ?? []
    )?.map((e) => e?.textContent?.trim());
    const info = spans?.reduce((e, c) => {
      const text = c?.split(" ");
      if (!text) return e;
      return {
        ...e,
        [text[0].trim().toLowerCase()]: text[1].trim(),
      };
    }, {} as Record<string, string>);

    if (!info.author) info.author = "N/A";

    let chapters: ChapterCandidate[] = [];

    doc
      ?.querySelector("#chapterlist")
      ?.querySelectorAll("a")
      ?.forEach((e) => {
        const href = e.getAttribute("href");
        if (!e.textContent) return;
        if (href?.includes("chapter"))
          chapters.push({
            name: this.chapterGuesser(e?.textContent),
            href,
          });
      });

    chapters = uniq(chapters);

    if (!title) {
      throw new Error("title not found");
    }

    const comic: Comic = {
      ...(info as unknown as Comic),
      thumb,
      name: title,
      alt_name: alt_title ?? [],
      description:
        doc?.querySelector(".entry-content-single")?.textContent ?? "",
      genres: genres ?? [],
      chapters,
      slug: slugify(title),
    };

    return comic;
  }
  public parseChapter(doc: Document): Chapter {
    const imgDom = Array.from(doc?.querySelectorAll("img") ?? []);

    const images = Array.from(
      imgDom.map((e) => e.getAttribute("src")?.replace("img.statically.io/img/manhwaindo/","")?.replace(IGNORE, "") ?? "")
    );

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

  // public static async parseAndUpload(url: string): Promise<Comic | void> {

  //   try {
  //     const { chapterscandidate } = await gkInteractor.sanityCheck(
  //       comic,
  //       chapters
  //     );

  //     let iter = 0;

  //     for (let i of chapterscandidate) {
  //       iter++;
  //       try {
  //         const chapter_req = await axios.get(i);

  //         const htmls = await chapter_req.data;

  //         const chapterDoc = new DOMParser().parseFromString(
  //           htmls,
  //           "text/html"
  //         );

  //         const url = chapterDoc?.querySelector("link[rel='alternate'][type='application/json']")?.getAttribute("href");

  //         if (!url) {
  //           return;
  //         }

  //         const jsonHtml = await (await axios.get(url)).data.content.rendered;

  //         const chapterJsonDoc = new DOMParser().parseFromString(
  //           jsonHtml,
  //           "text/html"
  //         );

  //         const imgDom = Array.from(chapterJsonDoc.querySelectorAll("img"));

  //         const images = imgDom.map((e) => e.getAttribute("src"));

  //         const target = chapterDoc?.querySelector("h1")?.textContent;

  //         try {
  //           const splits = target?.split(" ");

  //           const chunk = splits?.splice(splits?.length - 1);

  //           if (!chunk) {
  //             return;
  //           }

  //           const name = parseFloat(chunk[0]);

  //           if (isNaN(name)) {
  //             console.log(`NaN detected ${target}`);
  //             continue;
  //           }

  //           const chapter: Chapter = {
  //             name: `${name}`,
  //             image_count: 0,
  //             original_image_count: imgDom.length,
  //             processed: true,
  //             images: [],
  //             quality: 0,
  //           };

  //           console.log(chapter);

  //           let idx = 0;

  //           for (const x of images) {

  //             if (!x) {
  //               break;
  //             }

  //             const filename = filenameGueser(x);
  //             const ext = extExtractor(filename);

  //             const internalFilename = `${idx}.${ext}`;
  //             const internalPath = `/${comic.slug}/${chapter.name}/${internalFilename}`;

  //             const ulResponse = await downloadAndUpload(x, internalPath);

  //             console.log(
  //               `[${title}] [Chapter ${chapter.name}] [${internalFilename}] ${ulResponse.Message}`
  //             );

  //             chapter.images.push(internalPath);
  //             chapter.image_count++;
  //             idx++;
  //           }

  //           await gkInteractor.sanityEclipse(comic.slug, chapter);
  //         } catch (error) {
  //           console.log(target);
  //         }
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }

  //   return comic;
  // }
}
