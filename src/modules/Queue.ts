import { Queue } from "bullmq";
import { connection } from './Redis';
import { ChapterJob } from '../scrappers/scrapper';
import { Chapter } from "../browsers/src/types";


export const comicIncrementQueue = new Queue<{ id: number }>("comic increment", { connection });
export const chapterDownloadQueue = new Queue<{ chapter: Chapter }>("chapter downloads", { connection });
export const chapterIncrementQueue = new Queue<{ id: number }>("chapter increment", { connection });
export const chapterMigrationQueue = new Queue<{ chapter: ChapterJob }>("chapter migration", {
    connection,

});

