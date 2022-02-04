import axios, { Axios, AxiosInstance } from "axios";
import BunnyCDN from "../../modules/BunnyCDN";
import { gkInteractor } from "./gkInteractor";
import { Chapter, ChapterCandidate, Comic, ImageChapter } from './types';
import Logger from "../../modules/Logger";
import { slugify } from "../../modules/Helper";
export abstract class Scrapper {

    private _bunny: BunnyCDN
    private _axios: AxiosInstance
    public _logger: Logger

    constructor() {
        this._bunny = new BunnyCDN();
        this._axios = axios.create();
        this._logger = new Logger();

        // this._axios.interceptors.response.use((e) => {
        //     this._logger.error(`SCRAPPER Error : 📁 ${e.config.url}, ${e.status} , ${e.statusText} `)
        // })
    }

    public abstract getDeclaration(): ScrapperDeclaration;
    public abstract getUpdates(): string[];
    public abstract parseComic(dom: Document): Comic;
    public abstract parseChapter(dom: Document): Chapter;

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
    public downloadsImages(urls: ImageChapter[]) {
        const results = [];
        for (const x of urls) {
            this._bunny.downloadAndUpload(x.url, x.path);
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
                    throw new Error(`nan Detected ${e}`)
                }

                return name;
            }

            idx++;
        }
        throw new Error("Chapter name cant be guessed");
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

        try {
            await axios.get("https://backend.gudangkomik.com")
        } catch (error) {
            this._logger.warn('cant access gudangkomik ! is v2 activated ?')
            return;
        }

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

        const urls = [...new Set([...specials, ...this.getUpdates()])];

        let outer = 1;

        const bunny = new BunnyCDN();

        for (const x of urls) {
            try {

                if (ignores.includes(x)) {
                    this._logger.info(`${prefix} logger ignores ${x}`)
                };

                const comic = await this.getComic(x);

                const comPrefix = `[${comic.name}][${outer}/${urls.length}] `

                // check 

                this._logger.info(`${prefix}${comPrefix} checking chapter`);

                console.log(comic.chapters);

                const { chapterscandidate, status } = await gkInteractor.sanityCheck(comic, comic.chapters);

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

                let chapIdx = 1;
                const total = chapterscandidate.length;

                if (chapterscandidate.length != 0) {
                    this._logger.info(
                        `${prefix}${comPrefix} found ${chapterscandidate.length} new chapters`
                    );
                } else {
                    this._logger.info(`${prefix}${comPrefix} no new chapter for ${comic.name}`);
                }

                for (const x of chapterscandidate) {

                    const chapter = await this.getChapter(x, decl.annoying);
                    console.log(chapter)
                    this._logger.info(`${prefix} ${comPrefix} [${chapIdx}/${total}] downloading chapter ${chapter.name}`);
                    //@ts-ignore
                    chapter.imageUrls = this.downloadsImages(
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
                    )
                    //@ts-ignore
                    chapter.imageUrls = chapter.imageUrls.map(e => `https://cdn.gudangkomik.com${e}`)

                    this._logger.info(`${prefix} ${comPrefix} [${chapIdx}/${total}] finish downloading chapter ${chapter.name}`);




                    await gkInteractor.sanityEclipse(
                        comic.name,
                        chapter
                    )

                    chapIdx++;

                }

                if (comic.slug == slugify("Tale of a Scribe Who Retires to the Countryside")) return;

                // this.removeReq(x)
            } catch (error) {
                console.error(error)
            }
            outer++;
        }

        this._logger.info("[GK] done");

    }
}

export interface ScrapperDeclaration {
    name: string;
    url: string[];
    annoying?: boolean;
}

