import { Worker, Job } from "bullmq";
import { Chapter, ChapterCandidate, ImageChapter } from '../browsers/src/types';
import { prisma } from "./Context";
import { connection } from "./Redis";
import Logger from "./Logger";
import { mapLimit } from "async";
import BunnyCDN from "./BunnyCDN";
import { slugify } from "./Helper";
import { gkInteractor } from "./gkInteractor";
import {  ComicJob } from "../scrappers/scrapper";

const comicWorker = new Worker<{ id: string }>(
  "comic increment",
  async (job: Job) => {
    await connection.lpush(`comic-views`, job.data.id);

    // await updateDocumentIndex(job.data.id, "comics", update)

    return true;
  },
  {
    concurrency: 10,
    connection,
  }
);

const chapterWorker = new Worker<{ id: string }>(
  "chapter increment",
  async (job: Job) => {
    await connection.lpush(`chapter-views`, job.data.id);

    return true;
  },
  {
    concurrency: 10,
    connection,
  }
);

comicWorker.on("completed", (job: Job, returnvalue: any) => {
  console.log(`job finished increment comic ${job.data.id}`);
});

chapterWorker.on("completed", (job: Job, returnvalue: any) => {
  console.log(`job finished increment chapter ${job.data.id}`);
});

// const chapterMigrationWorker = new Worker<{ chapter: Chapter }>('chapter migration', join(__dirname, "../scripts/jobs", "process-chapter-migration.ts"), {
//     lockDuration: 1000 * 60 * 3,
//     lockRenewTime: 1000 * 60 * 1,
//     concurrency: 5,
//     connection
// })

// chapterMigrationWorker.on('completed', (job: Job, returnvalue: Chapter) => {
//     console.log(`job finished migration chapter ${returnvalue.name}`);
// });

const chapterDownloadsWorker = new Worker<{ id: string }>(
  "chapter downloads",
  async (job: Job) => {},
  {
    concurrency: 10,
    connection,
  }
);

const _logger = new Logger();
const _bunny = new BunnyCDN({
  log: false,
  axiosDefault: {
    // httpsAgent
  },
});
async function downloadsImages(urls: ImageChapter[]) {
  const results: string[] = [];

  await mapLimit(urls, 3, async (x, d) => {
    try {
      await _bunny.downloadAndUpload(x.url, x.path);
      results.push(x.path);
    } catch (e) {
      await _bunny.downloadAndUpload(
        x.url.replace("https://img.statically.io/img/kcast/", "https://"),
        x.path
      );
      results.push(x.path);
    }
  });

  return results;
}

function createImagePath(
    slug: string,
    chapIndex: number,
    imgIndex: number,
    ext: string
  ) {
    return `/${slug}/${chapIndex}/${imgIndex}.${ext}`;
  }

  export interface ChapterJob {
  chapter: Chapter;
  comic: ComicJob;
}
const  extExtractor = (url: string) =>
    url.split(".")[url.split(".").length - 1];
chapterDownloadsWorker.on("completed", async (job: Job, returnvalue: any) => {
    console.log(`job finished increment comic ${job.data.id}`);
    const { chapter, comic } = job.data as ChapterJob
 
});

console.log("worker starting .....");
