import axios, { Axios, AxiosInstance } from "axios";
import BunnyCDN from "../../modules/BunnyCDN";
import { gkInteractor } from './gkInteractor';
import { Chapter, ChapterCandidate, Comic, ImageChapter } from './types';
import Logger from "../../modules/Logger";
import { slugify } from "../../modules/Helper";
import { DOSpaces } from "../../modules/DOSpaces";
export abstract class Scrapper {

    private _axios: AxiosInstance
    public _logger: Logger

    constructor() {

        this._axios = axios.create();
        this._logger = new Logger();

        // this._axios.interceptors.response.use((e) => {
        //     this._logger.error(`SCRAPPER Error : 📁 ${e.config.url}, ${e.status} , ${e.statusText} `)
        // })
    }

    public abstract getDeclaration(): ScrapperDeclaration;
    public abstract getUpdates(dom: Document): string[];
    public abstract parseComic(dom: Document): Comic;
    public abstract parseChapter(dom: Document): Chapter;
    public abstract getPageRangeUrl(x: number): string[];

    public async getDOM(url: string) {
        try {
            return await (await this._axios.get(url)).data
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

    public async getComic(url: string) {

        try {
            return this.parseComic(
                (new DOMParser).parseFromString(await (await this._axios.get(url)).data, "text/html")
            )
        } catch (error) {
            console.log(error)
            throw error;
        }


    }

    public async getChapter(url: string, annoying: boolean = false) {

        try {
            const text = await (await this._axios.get(url)).data;

            let dom;
            if (annoying) {
                dom = (new DOMParser).parseFromString(text, "text/html");
                const href = dom?.querySelector("link[rel='alternate'][type='application/json']")?.getAttribute("href") ?? ""
                const jsonHtml = await (await axios.get(href)).data;
                dom = new DOMParser().parseFromString(
                    `
                <h1>${jsonHtml.title.rendered}</h1>
                ${jsonHtml.content.rendered}`,
                    "text/html"
                );



            } else {
                dom = (new DOMParser).parseFromString(
                    `${text}`
                    , "text/html");
            }


            return this.parseChapter(
                dom
            )
        } catch (error) {
            console.log(error)
            throw error;
        }


    }


    public commitCommic(comic: Comic, chapters: ChapterCandidate[]) {
        return gkInteractor.sanityCheck(comic, chapters);
    }


    public createImagePath(slug: string, chapIndex: number, imgIndex: number, ext: string) {
        return `/${slug}/${chapIndex}/${imgIndex}.${ext}`
    }
    public async downloadsImages(urls: ImageChapter[]) {
        const results = [];
        for (const x of urls) {
            await gkInteractor.uploadImage(x.url, x.path);
            results.push(x.path);
        }

        return results
    }

    public chapterGuesser(e: string) {


        const splits = e.split(" ");
        let idx = 0;

        for (const x of splits) {

            if (x.toLocaleLowerCase() == "chapter") {
                const name = parseFloat(
                    splits[idx + 1]
                )

                if (isNaN(name)) {
                    // throw new Error(`nan Detected ${e}`)
                    console.log(`nan Detected ${e}`)
                    return 0;
                }

                return name;
            }

            idx++;
        }

        throw new Error(`Chapter name cant be guessed ${e}`);
    }


    public checkQuality(e: string) {
        const t = e.toLowerCase()

        for (const x of t.split(" ")) {
            switch (x) {
                case 'hq':
                    return 2
                case 'lq':
                    return 1

            }
        }
        return 0;
    }

    public extExtractor = (url: string) => url.split(".")[url.split(".").length - 1]
    public removeReq = async (link: string) =>
        await axios.post("https://gudangkomik.com/api/special-remove", {
            special: link,
        });

    public async run() {

        // check gudang can be accessed

        // try {
        //     await axios.get("https://backend.gudangkomik.com")
        // } catch (error) {
        //     this._logger.warn('cant access gudangkomik ! is v2 activated ?')
        //     return;
        // }

        const decl = this.getDeclaration();
        const prefix = `[${decl.name}]`

        if (!decl.url.includes(location.href)) {
            this._logger.info(`not match ${location.href} ${decl.url}`)
            return;
        }



        this._logger.info(`${prefix} fetching ignores and specials`);

        // const ignores: string[] = await (
        //     await axios.get("https://gudangkomik.com/api/ignore")
        // ).data.ignore;

        // const specials: string[] = await (
        //     await axios.get("https://gudangkomik.com/api/special")
        // ).data.special.filter((x: string) => (x.includes(decl.name)));

        const specials: string[] = [];
        const ignores: string[] = [];
        this._logger.info(`${prefix} finish ignores and specials`);


        try {

        } catch (error) {
            console.log(error)
            throw error;
        }

        const xd: string[] = [];

        for (const e of this.getPageRangeUrl(1)) {
            console.log(e)
            for (const up of this.getUpdates((new DOMParser).parseFromString(await (await axios.get(e)).data, "text/html"))) {
                xd.push(up)
            }
        }

        const urls = [...new Set([...specials, ...this.getUpdates(document)]), ...xd];

        let outer = 1;

        const bunny = new BunnyCDN();


        interface ComicJob extends Comic {
            chaptersList: number[];
        }

        interface ChapterJob {
            chapter: ChapterCandidate;
            comic: ComicJob;
        }

        const chaptersBatchJobs: ChapterJob[] = [];

        const ignoresS = ["https://komikcast.com/komik/megami-no-kafeterasu-goddess-cafe-terrace/"];

        for (const x of urls) {
            if (ignores.includes(x)) continue;
            try {

                if ([...ignoresS, ...ignores].includes(x)) {
                    this._logger.info(`${prefix} logger ignores ${x}`)
                };

                const comic = await this.getComic(x);

                const comPrefix = `[${outer}/${urls.length}][${comic.name}] `

                // check 

                // this._logger.info(`${prefix}${comPrefix} checking chapter`);

                const { chapterscandidate, status, chaptersList } = await gkInteractor.sanityCheck(comic, comic.chapters);
                if (status == "new") {

                    try {
                        const { thumb, slug } = comic;
                        bunny.downloadAndUpload(thumb, `/${slug}/thumb.jpg`);

                        // if (thumbWide) {

                        //     bunny.downloadAndUpload(thumbWide, `/${slug}/thumbWide.jpg`);


                        // }

                    } catch (error) {

                        console.log('cannot donwload thumb, posibly v2 interfering')

                        comic.thumb = "https://cdn.gudangkomik.com/fallback.jpg"
                    }

                }

                if (!comic.type) {
                    comic.type = "N/A"
                }

                if (chapterscandidate.length != 0) {
                    this._logger.info(
                        `${prefix}${comPrefix} found ${chapterscandidate.length} new chapters that is ${chapterscandidate.map(x => x.name).join(", ")}`
                    );
                } else {
                    this._logger.info(`${prefix}${comPrefix} no new chapter`);
                }



                for (const x of chapterscandidate) {

                    chaptersBatchJobs.push({
                        comic: { ...comic, chaptersList },
                        chapter: x,
                    })

                }


                // this.removeReq(x)
            } catch (error) {
                console.error(error)
            }
            outer++;
        }


        this._logger.info(`${prefix} fetching chapters`);

        const total = chaptersBatchJobs.length;
        let chapIdx = 0;

        const chaptersExistMap = new Map<string, string[]>();

        for (const { chapter: x, comic } of chaptersBatchJobs) {
            try {


                const chapterExist = chaptersExistMap.get(comic.slug)

                if (!chapterExist) chaptersExistMap.set(comic.slug, [])



                const chapter = await this.getChapter(x.href, decl.annoying);


                if (x.name != chapter.name) {
                    if (comic.chaptersList.includes(chapter.name) || comic.chaptersList.includes(x.name)) {
                        this._logger.warn(`${prefix} ${comic.slug} chapter name mismatch ${x.name} ${chapter.name} already exists skipping ...`)
                        chapIdx++;
                        continue
                    }
                    chapterExist?.push(`${comic.slug}-${chapter.name}`)
                    chapterExist?.push(`${comic.slug}-${x.name}`)
                } else {
                    chapterExist?.push(`${comic.slug}-${chapter.name}`)
                }


                if (chapterExist && chapterExist.includes(`${comic.slug}-${chapter.name}`)) {

                    this._logger.warn(`${prefix} ${comic.slug} chapter name ${x.name} ${chapter.name} already scrapped skipping ...`)
                    chapIdx++;
                    continue
                }




                this._logger.info(`${prefix} ${comic.slug} [${chapIdx}/${total}] downloading chapter ${chapter.name}`);

                const downloadeds = await this.downloadsImages(
                    chapter.images.map((e, i: number) => {
                        return {
                            path: this.createImagePath(
                                comic.slug ?? slugify(comic.name),
                                chapter.name,
                                i,
                                this.extExtractor(e)

                            ),
                            url: e
                        }
                    })
                );

                //@ts-ignore
                chapter.imageUrls = downloadeds
                //@ts-ignore
                chapter.imageUrls = chapter.imageUrls.map(e => `https://cdn.gudangkomik.com${e}`)

                if (downloadeds.length == chapter.images.length) {
                    await gkInteractor.sanityEclipse(
                        comic.name,
                        chapter
                    )
                    chapIdx++;
                } else {
                    this._logger.info(`${prefix} ${comic.slug} [${chapIdx}/${total}] failed downloading chapter ${chapter.name} [number not match]`);

                }
            } catch (error) {
                console.log(`error ${comic.name} ${x} ${error}`)
            }
        }

        this._logger.info("[GK] done");

    }
}

export interface ScrapperDeclaration {
    name: string;
    url: string[];
    annoying?: boolean;
}

