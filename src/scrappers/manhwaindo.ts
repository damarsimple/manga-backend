import { url } from "inspector";
import { uniq } from "lodash";
import { Chapter, ChapterCandidate, Comic } from "../browsers/src/types";
import { slugify } from "../modules/Helper";
import { Scrapper } from "./scrapper";

// SAME TEMPLATE AS MANHWAINDO

const IGNORE = "imagesimple.co/img/manhwaindo/";

export default class Manhwaindo extends Scrapper {
    private withAll = false;

    public getPageRangeUrl(x: number): string[] {
        const rets = [];

        for (let index = 1; index <= x; index++) {
            rets.push(`https://manhwaindo.id/series/?page=${index}&order=update`);
        }

        return rets;
    }
    public getDeclaration() {
        

        const url =  [
            "https://manhwaindo.id/",
        ]

        if (this.withAll) {
            url.push("https://manhwaindo.id/series/list-mode/")
        }

        return {
            name: "Manhwaindo",
            url,
            annoying: true,
            customHeaders: {
                "Referer": "https://manhwaindo.id/",
            }
        };
    }
    public getUpdates(document : Document): string[] {
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
            imgDom.map((e) => 
                e.getAttribute("src")?.startsWith("https://cdn.manhwaindo.id/storage/drive/") ?
                    e.getAttribute("src")?.replace("cdn.manhwaindo.id", "cdn.kambingjantan.cc") ?? "":
                e.getAttribute("src")?.replace("img.statically.io/img/manhwaindo/", "")?.replace(IGNORE, "") ?? "")
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
    constructor({
        withAll = false,
    }) {
        super({
        });

        this.withAll = withAll;
    }
}