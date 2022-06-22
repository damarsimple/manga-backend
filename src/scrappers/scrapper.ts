import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import {
  Chapter,
  ChapterCandidate,
  Comic,
  ImageChapter,
} from "../browsers/src/types";
import BunnyCDN from "../modules/BunnyCDN";
import { gkInteractor } from "../modules/gkInteractor";
import { slugify } from "../modules/Helper";
import Logger from "../modules/Logger";

import { mapLimit } from "async";
import HttpsProxyAgent from "https-proxy-agent";
import kcAll from "./kc-all";
import { chapterDownloadQueue } from "../modules/Queue";

// const httpsAgent =  HttpsProxyAgent({host: "localhost", port: "8191"})
export interface ComicJob extends Comic {
  chaptersList: number[];
}

export interface ChapterJob {
  chapter: ChapterCandidate;
  comic: ComicJob;
}
interface ScrapperProps {
  axiosDefault?: AxiosRequestConfig;
  useProxyDownload?: boolean;
  useProxyFetch?: boolean;
}

export abstract class Scrapper {
  private _bunny: BunnyCDN;
  public axios: AxiosInstance;
  public _logger: Logger;

  constructor({
    axiosDefault,
    useProxyDownload,
    useProxyFetch,
  }: ScrapperProps) {
    this._bunny = new BunnyCDN({
      // downloadResponseType: "blob",
      log: false,
      axiosDefault: {
        // httpsAgent
      },
    });

    this.axios = axios.create({
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36",
      },
      ...axiosDefault,
      // httpsAgent
    });
    this._logger = new Logger();

    this.axios.get("https://api.myip.com").then((e) => console.log(e.data));
    this.axios
      .get("http://ssh.damaral.my.id:9696/gk-update")
      .then((e) => console.log(e.data))
      .catch(() => {
        this._logger.warn("can contact telegram bot ...");
      });

    // this._axios.interceptors.response.use((e) => {
    //     this._logger.error(`SCRAPPER Error : 📁 ${e.config.url}, ${e.status} , ${e.statusText} `)
    // })
  }

  public abstract getUpdates(): Promise<string[]>;
  public abstract getComic(url: string): Promise<Comic>;
  public abstract getChapter(url: string): Promise<Chapter>;

  public createImagePath(
    slug: string,
    chapIndex: number,
    imgIndex: number,
    ext: string
  ) {
    return `/${slug}/${chapIndex}/${imgIndex}.${ext}`;
  }
  public async downloadsImages(urls: ImageChapter[]) {
    const results: string[] = [];

    await mapLimit(urls, 3, async (x, d) => {
      try {
        await this._bunny.downloadAndUpload(x.url, x.path);
        results.push(x.path);
      } catch (e) {
        await this._bunny.downloadAndUpload(
          x.url.replace("https://img.statically.io/img/kcast/", "https://"),
          x.path
        );
        results.push(x.path);
      }
    });

    return results;
  }

  public chapterGuesser(e: string) {
    const splits = e.split(" ");
    let idx = 0;

    try {
      for (const x of splits) {
        if (x.toLocaleLowerCase() == "chapter") {
          const name = parseFloat(splits[idx + 1]);

          if (isNaN(name)) {
            // throw new Error(`nan Detected ${e}`)
            throw Error(`nan Detected ${e}`);
          }

          return name;
        }

        idx++;
      }
    } catch (error) {
      for (const x of splits) {
        const name = parseFloat(x);

        if (isNaN(name)) continue;

        return name;
      }
    }

    throw new Error(`Chapter name cant be guessed ${e}`);
  }

  public checkQuality(e: string) {
    const t = e.toLowerCase();

    for (const x of t.split(" ")) {
      switch (x) {
        case "hq":
          return 2;
        case "lq":
          return 1;
      }
    }
    return 0;
  }

  public extExtractor = (url: string) =>
    url.split(".")[url.split(".").length - 1];
  public removeReq = async (link: string) =>
    await axios.post("https://gudangkomik.com/api/special-remove", {
      special: link,
    });

  public async run() {
    const ignores: string[] = [];
    const xd: string[] = [];
    const specials: string[] = [];
    const prefix = "[KC-API]";

    for (const up of await this.getUpdates()) {
      xd.push(up);
    }

    console.log(`found ${xd.length} title to scraps`);

    const urls = [
      ...new Set([
        ...specials,
        ...xd,
        ...kcAll.map((e) => e.replace("https://komikcast.me/komik/", "")),
      ]),
    ];

    let outer = 1;

    const chaptersBatchJobs: ChapterJob[] = [];

    let totalComic = urls.length;

    await mapLimit(urls, 50, async (x, done) => {
      if (ignores.includes(x)) {
        totalComic--;
        return;
      }
      try {
        if ([...ignores].includes(x)) {
          this._logger.info(`${prefix} logger ignores ${x}`);
        }

        const comic = await this.getComic(x);

        const comPrefix = `[${totalComic}][${comic.name}] `;

        const { chapterscandidate, status, chaptersList } =
          await gkInteractor.sanityCheck(comic, comic.chapters);

        if (status == "new") {
          const { thumb, slug, thumb_wide } = comic;

          try {
            const thumbNew = `/${slug}/thumb.jpg`;

            const urlCandidate = thumb?.startsWith("https://")
              ? `https://img.statically.io/img/kcast/${thumb?.replace(
                  "https://",
                  ""
                )}`
              : thumb;

            this._bunny.downloadAndUpload(urlCandidate, thumbNew).catch((e) => {
              throw Error(`error thumb ${urlCandidate}`);
            });

            comic.thumb = `https://cdn3.gudangkomik.com${thumbNew}`;

            if (thumb_wide && thumb != thumb_wide) {
              const thumbWideCandidate = thumb_wide?.startsWith("https://")
                ? `https://img.statically.io/img/kcast/${thumb?.replace(
                    "https://",
                    ""
                  )}`
                : thumb_wide;
              this._bunny
                .downloadAndUpload(thumbWideCandidate, `/${slug}/thumbWide.jpg`)
                .catch((e) => {
                  throw Error(`error thumbWide ${thumbWideCandidate}`);
                });

              comic.thumb_wide = `https://cdn3.gudangkomik.com${`/${slug}/thumbWide.jpg`}`;
            }
          } catch (error) {
            console.log("cannot donwload thumb, posibly v2 interfering");

            comic.thumb = "https://cdn3.gudangkomik.com/fallback.jpg";
          }
        }

        if (!comic.type) {
          comic.type = "N/A";
        }

        if (chapterscandidate.length != 0) {
          this._logger.info(
            `${prefix}${comPrefix} found ${
              chapterscandidate.length
            } new chapters that is ${chapterscandidate
              .map((x) => x.name)
              .join(", ")}`
          );
        } else {
          this._logger.info(`${prefix}${comPrefix} no new chapter`);
        }

        for (const x of chapterscandidate) {
          chaptersBatchJobs.push({
            comic: { ...comic, chaptersList },
            chapter: x,
          });
        }
      } catch (error) {
        console.error(error);
      }
      totalComic--;
    });

    this._logger.info(`${prefix} fetching chapters`);

    let total = chaptersBatchJobs.length;

    const chaptersExistMap = new Map<string, string[]>();

    await mapLimit(
      chaptersBatchJobs,
      30,
      async ({ chapter: x, comic }, done) => {
        try {
          
          const chapterExist = chaptersExistMap.get(comic.slug);

          if (!chapterExist) chaptersExistMap.set(comic.slug, []);

          const chapter = await this.getChapter(x.href);

          chapterDownloadQueue.add("chapter downloads", {chapter})
        } catch (error) {
          console.log(`error ${comic.name} ${x} ${error}`);
        }
      }
    );

    this._logger.info("[GK] done");
  }
}
