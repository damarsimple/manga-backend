import { Chapter } from "@prisma/client";
import { Queue } from "bullmq";
import { connection } from './Redis';


export const comicIncrementQueue = new Queue<{ id: number }>("comic increment", { connection });
export const chapterIncrementQueue = new Queue<{ id: number }>("chapter increment", { connection });
export const chapterMigrationQueue = new Queue<{ chapter: Chapter }>("chapter migration", { connection });

