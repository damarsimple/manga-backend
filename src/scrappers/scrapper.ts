import axios, { AxiosInstance, AxiosRequestConfig,AxiosRequestHeaders } from "axios";
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
import cluster, { Worker } from "node:cluster";
import { cpus } from "node:os";
import process from "node:process";

import { connection } from "../modules/Redis";
import { JSDOM } from "jsdom";
import { chunk } from "lodash";

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
  private chaptersExistMap = new Map<string, string[]>();

  private  firstRun = true;
  private  workers = new Map<number, Worker>();
  private  workersProcessed = new Map<number, number>();
  private  intervalId : NodeJS.Timeout | undefined;
  private  wokenUp = cluster.isPrimary;
  constructor({
    axiosDefault,
    useProxyDownload,
    useProxyFetch,
  }: ScrapperProps) {
    const { customHeaders } = this.getDeclaration();
    this._bunny = new BunnyCDN({
      // downloadResponseType: "blob",
      log: false,
      axiosDefault: {
        // httpsAgent
        ...(customHeaders ?? {})
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
    if (cluster.isWorker) {
      this.runWorker();
    }
  }

  public abstract getDeclaration(): {
    name: string;
    url: string[];
    annoying?: boolean;
    customHeaders?:AxiosRequestHeaders
  };
  public abstract getUpdates(html: Document): string[];
  public abstract parseComic(html: Document): Comic;
  public abstract parseChapter(html: Document): Chapter;

  public startMonitoring() { 

    if (this.intervalId) {
      return;
    }

    this.intervalId = setInterval(async () => {
      let queueLength = await connection.llen("scrapper-queue-chapters" + "-" + this.getDeclaration().name.toLowerCase());
      
      for(const worker of this.workers.values()) {
        const processed = this.workersProcessed.get(worker.id)
        this._logger.info(
          `[${this.getDeclaration().name}][THREAD-${worker.id}][LENGTH-${queueLength}] processed ${processed} chapters`
        );
      }

    }, 1000 * 5);

    

  }

  public stopMonitoring() {

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  public incrementWorker(workerId: number) {
    const processed = this.workersProcessed.get(workerId) || 0;
    this.workersProcessed.set(workerId, processed + 1);

    this._logger.info(
      `[THREAD-${workerId}] processed ${processed} chapters`
    );

  }

  public async runWorker() {
    if (cluster.isPrimary) {
      this._logger.info("primary worker " + this.getDeclaration().name);

      if (this.workers.size !== 0) {
        this._logger.info("workers already initialized");
        return;
      }


      for (let i = 0; i < cpus().length; i++) {
        const worker = cluster.fork();

        if (!worker) {
          this._logger.info(`worker ${i} failed`);
          break;
        }

        worker.on("exit", (code, signal) => {
          this._logger.error(`worker ${worker.id} died`);
          this._logger.error(`code: ${code}`);
          this._logger.error(`signal: ${signal}`);
          this._logger.error(`forking new worker`);
          cluster.fork();
        });

        worker.on("error", (err) => {
          this._logger.error(`worker ${worker.id} error`);
          this._logger.error(`error: ${err}`);
          this._logger.error(`forking new worker`);
          cluster.fork();
        });

        worker.on("message", (msg) => {
          if (msg == "finished-job") {
            this.incrementWorker(worker.id);
           }
        });

        this.workers.set(worker.id, worker);

        this._logger.info(`worker ${worker.id} started`);
      }



    } else {
      process.on("message", (msg) => {
        if ((msg = "wake-up")) {
          this.workerFunction();
        }
      });
    }
  }

  public async workerFunction() {
    if (this.wokenUp) {
      // this._logger.info("worker wake-up already woke up");
      return;
    }

    this.wokenUp = true;

    let queueLength = await connection.llen("scrapper-queue-chapters" + "-" + this.getDeclaration().name.toLowerCase());

    while (queueLength > 0) {
      const job = (await connection.lpop("scrapper-queue-chapters" + "-" + this.getDeclaration().name.toLowerCase())) as string;

      if (job) {
        const { chapterUrl, comic } = JSON.parse(job);
        this._logger.info(`fetching ${chapterUrl} of ${comic.name}`);

        const text = await (await this.axios.get(chapterUrl)).data;

        let dom;

        if (this.getDeclaration().annoying) {
          dom = new JSDOM(text).window.document;

          const href =
            dom
              ?.querySelector("link[rel='alternate'][type='application/json']")
              ?.getAttribute("href") ?? "";

          const jsonHtml = await (await axios.get(href)).data;

          dom = new JSDOM(`
          <h1>${jsonHtml.title.rendered}</h1>
          ${jsonHtml.content.rendered}`).window.document;
        } else {
          dom = new JSDOM(text).window.document;
        }

        const chapter = await this.parseChapter(dom);

        const chapterJob = {
          chapter,
          comic,
        };

        this._logger.info(
          `[THREAD-${cluster?.worker?.id}] downloading chapter ${chapter.name}`
        );

        await this.downloadChapter(chapterJob);

        this._logger.info(
          `[THREAD-${cluster?.worker?.id}]  chapter ${chapter.name} of ${comic.name} downloaded`
        );

        process.send && process.send("finished-job");
      } else {
        this._logger.info(`no job`);
      }

      queueLength = await connection.llen("scrapper-queue-chapters" + "-" + this.getDeclaration().name.toLowerCase());
    }

    this._logger.info(`[THREAD-${cluster?.worker?.id}] worker  finished`);
  }

  public createImagePath(
    slug: string,
    chapIndex: number,
    imgIndex: number,
    ext: string
  ) {
    return `/${slug}/${chapIndex}/${imgIndex}.${ext}`;
  }
  public async downloadsImages(targets: ImageChapter[]) {

    const ignore = ["sstatic1.histats.com"];

    let urls = targets.filter(
      (target) => {
        
        for (const ig of ignore) {
          if (target.url.includes(ig)) {
            return false;
          }
        }

        return true;

      }
    )

    const results: string[][] = [];

    for (const chunkD of chunk(urls, cpus().length * 2)) {
      const promises = chunkD.map(async (x) => {
        try {
          await this._bunny.downloadAndUpload(x.url, x.path);

          return x.path;
        } catch (e) {
          await this._bunny.downloadAndUpload(
            x.url.replace("https://img.statically.io/img/kcast/", "https://"),
            x.path
          );
          return x.path;
        }
      });

      results.push(await Promise.all(promises));
    }

    const outputs = results.flat();

    if (urls.length !== outputs.length) {
      this._logger.info(`failed downloading chapter  [number not match]`);

      throw new Error(`failed downloading chapter  [number not match]`);
    }

    
    return outputs;
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

    // throw new Error(`Chapter name cant be guessed ${e}`);
    return 0;
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
    if (!cluster.isPrimary) return;
    const prefix = `[${this.getDeclaration().name.toUpperCase()}-API]`;

    if (this.firstRun) {
      await connection
      .del("scrapper-queue-chapters" + "-" + this.getDeclaration().name.toLowerCase())
        .then(() => this.runWorker());
      this.firstRun = false;

      this._logger.info(`queue cleared`);
    }

    const ignores: string[] = [];
    const xd: string[] = [];
    const specials: string[] = [];

    // for (const up of await this.getUpdates(
    // new JSDOM(await this.axios.get('https://komikcast.me').then((e) => e.data)).window.document
    // )) {
    // xd.push(up);
    // }

    const PER_PART = Math.floor(kcAll.length / cpus().length);

    const d = await this.getDeclaration()
      .url.map(async (e) => await this.axios.get(e).then((e) => e.data))
      .map(async (e) => new JSDOM(await e).window.document);

    const updates = await Promise.all(d);

    const updates2 = await updates.map(this.getUpdates).flat();

    for (let PART = 0; PART < cpus().length; PART++) {
      const urls = [
        ...new Set([
          // ...specials,
          // ...xd,
          // ...kcAll,
          ...updates2,
        ]),
      ].slice(PART * PER_PART, (PART + 1) * PER_PART);

      const chaptersBatchJobs: ChapterJob[] = [];

      let totalComic = urls.length;

      console.log(
        `${PART * PER_PART} ${
          (PART + 1) * PER_PART
        } found ${totalComic} comics to scraps`
      );

      for (const chunkD of chunk(urls, 50)) {
        const promises = chunkD.map(async (x) => {
          if (ignores.includes(x)) {
            totalComic--;
            return;
          }
          try {
            if ([...ignores].includes(x)) {
              this._logger.info(`${prefix} logger ignores ${x}`);
            }

            const comic = await this.parseComic(
              new JSDOM(await this.axios.get(`${x}`).then((e) => e.data)).window
                .document
            );

            const comPrefix = `[${totalComic}][${comic.name}] `;

            const { chapterscandidate, status, chaptersList } =
              await gkInteractor.sanityCheck(comic, comic.chapters);

            // if (status == "new") {
            //   const { thumb, slug, thumb_wide } = comic;

            //   try {
            //     const thumbNew = `/${slug}/thumb.jpg`;

            //     const urlCandidate = thumb?.startsWith("https://")
            //       ? `https://img.statically.io/img/kcast/${thumb?.replace(
            //         "https://",
            //         ""
            //       )}`
            //       : thumb;

            //     this._bunny.downloadAndUpload(urlCandidate, thumbNew)
            //     comic.thumb = `https://cdn3.gudangkomik.com${thumbNew}`;
            //   } catch (error) {
            //     console.log("cannot donwload thumb, posibly v2 interfering");

            //     comic.thumb = "https://cdn3.gudangkomik.com/fallback.jpg";
            //   }
            //   if (thumb_wide && thumb != thumb_wide) {
            //     try {
            //       const thumbWideCandidate = thumb_wide?.startsWith("https://")
            //         ? `https://img.statically.io/img/kcast/${thumb?.replace(
            //           "https://",
            //           ""
            //         )}`
            //         : thumb_wide;
            //       this._bunny
            //         .downloadAndUpload(thumbWideCandidate, `/${slug}/thumbWide.jpg`)

            //       comic.thumb_wide = `https://cdn3.gudangkomik.com${`/${slug}/thumbWide.jpg`}`;
            //     } catch (error) {

            //     }
            //   }

            // }

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

        await Promise.all(promises);
      }

      this._logger.info(`${prefix} pushing chapters`);

      let idx = 0;

      this.startMonitoring();


      for (const { chapter: x, comic } of chaptersBatchJobs) {
        try {
          const chapterExist = this.chaptersExistMap.get(comic.slug);

          if (!chapterExist) this.chaptersExistMap.set(comic.slug, []);

          // const chapter = await this.parseChapter(
          //   new JSDOM(await this.axios.get(x.href).then((e) => e.data)).window.document
          // );

          this._logger.info(
            `[${idx}/${chaptersBatchJobs.length}] ${prefix} pushing ${x.name}`
          );

          connection.lpush(
            "scrapper-queue-chapters" + "-" + this.getDeclaration().name.toLowerCase(),
            JSON.stringify({ chapterUrl: x.href, comic })
          );
        } catch (error) {
          console.log(`error ${comic.name} ${x} ${error}`);
        }
        idx++;
      }
      this._logger.info(`${prefix} finish pushing chapters`);

      this._logger.info("[GK] fetching done");

      for (const [id, worker] of this.workers) {
        worker.send("wake-up", () =>
          this._logger.info(`${prefix} woken up worker ${id}`)
        );
      }

    }
  }

  public async downloadChapter({
    chapter,
    comic,
  }: {
    chapter: Chapter;
    comic: ComicJob;
  }) {
    try {
      let cpChapter = {
        imageUrls: [] as string[],

        ...chapter,

        image_count: 0,
        processed: true,
        original_image_count: 0,
        quality: 0,
      };

      const downloadeds = await this.downloadsImages(
        cpChapter.images.map((e, i: number) => {
          return {
            path: this.createImagePath(
              comic.slug ?? slugify(comic.name),
              chapter.name,
              i,
              this.extExtractor(e)
            ),
            url: e,
          };
        })
      );

      cpChapter.imageUrls = downloadeds.map(
        (e: string) => `https://cdn3.gudangkomik.com${e}`
      );

      cpChapter.image_count = cpChapter.imageUrls.length;

      await gkInteractor.sanityEclipse(comic.name, cpChapter);
    } catch (error) {
      console.log(`error ${comic.name}  ${error}`);
    }
  }
}
