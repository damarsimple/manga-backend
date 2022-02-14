import { Queue } from "bullmq";
import { connection } from './Redis';


export const comicIncrementQueue = new Queue<{ id: number }>("comic increment", { connection });
export const chapterIncrementQueue = new Queue<{ id: number }>("chapter increment", { connection });

