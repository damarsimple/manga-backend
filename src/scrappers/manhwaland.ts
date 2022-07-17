import { uniq } from "lodash";
import { Chapter, ChapterCandidate, Comic } from "../browsers/src/types";
import { slugify } from "../modules/Helper";
import { Scrapper } from "./scrapper";

// SAME TEMPLATE AS MANHWAINDO

export default class Manhwaland extends Scrapper {
  private withAll = false;
  public getPageRangeUrl(x: number): string[] {
    const rets = [];

    for (let index = 1; index <= x; index++) {
      rets.push(`https://manhwaland.mom/series/?page=${index}&order=update`);
    }

    return rets;
  }
  public getDeclaration() {

    const url =  [
      "https://manhwaland.mom/",
      //,
    ]

    if (this.withAll) {
      url.push("https://manhwaland.mom/series/list-mode/")
  }

    return {
      name: "Manhwaland",
      url,
      annoying: false,
    };
  }
  public getUpdates(document : Document): string[] {
    const links = new Set<string>();
    document.querySelectorAll("a").forEach((e) => {
      const link = e.getAttribute("href");
      if (
        link &&
        link.includes("https://manhwaland.mom/series/") &&
        link !== "https://manhwaland.mom/series/list-mode/"
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
      ?.textContent?.replace("Manhwa ", "")
      ?.trim();
    const thumb =
      doc?.querySelector(".thumb")?.querySelector("img")?.getAttribute("src") ??
      "";
    const alt_title = doc
      ?.querySelector("span, .alternative")
      ?.textContent?.split(",");
    const genres = Array.from(
      doc?.querySelector(".mgen")?.querySelectorAll("a") ?? []
    )?.map((e) => e.textContent ?? "");
    const spans = Array.from(doc?.querySelectorAll(".imptdt") ?? [])?.map((e) =>
      e?.textContent?.trim()
    );

    const info = spans?.reduce((e, c) => {
      const text = c?.split(" ");
      if (!text) return e;
      return {
        ...e,
        [text[0]?.trim().toLowerCase()]: text[1]?.trim(),
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
      isHentai: true,
    };

    return comic;
  }
  public parseChapter(doc: Document): Chapter {
    const imgDom = Array.from(doc?.querySelector("#readerarea")?.querySelectorAll("img") ?? []);

    const remove = ["https://manhwaindo.id/wp-content/uploads/2021/07/banner-ads.png?w=1440"];

    const images = Array.from(
      imgDom.map(
        (e) =>
          e
            .getAttribute("src")
            ?.replace("img.statically.io/img/manhwaindo/", "") ?? ""
      )
    ).filter((e) => !remove.includes(e));




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
  constructor({
    withAll = false,
}) {
    super({});
    this.withAll = withAll;
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
