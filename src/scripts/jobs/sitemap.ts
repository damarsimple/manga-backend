import { PrismaClient } from '@prisma/client';
import Sitemap from '../../modules/Sitemap';
import {
    writeFileSync
} from "fs"
import { prisma } from '../../modules/Context';
import { parentPort } from "worker_threads";


const { SITEMAP_PATH } = process.env;

const generate = async () => {

    console.log(`generating sitemaps ${(new Date).toISOString()}`);

    const sitemap = new Sitemap();


    const comics = await prisma.comic.findMany();
    const genres = await prisma.genre.findMany();
    const authors = await prisma.author.findMany();


    sitemap.add({
        loc: `${process.env.APP_HOST}/`,
        lastmod: (new Date).toISOString(),
        changefreq: "daily",
        priority: 1
    })

    for (const x of ["hot", "rekomendasi", "terbaru", "all"]) {
        sitemap.add({
            loc: `${process.env.APP_HOST}/list/comic/${x}`,
            lastmod: (new Date).toISOString(),
            changefreq: "daily",
            priority: 0.8
        })
    }

    for (const comic of comics) {
        sitemap.add({
            loc: `${process.env.APP_HOST}/comic/${comic.slug}`,
            lastmod: comic.updatedAt.toISOString(),
            changefreq: "monthly",
            priority: 0.8
        })
    }

    for (const genre of genres) {
        sitemap.add({
            loc: `${process.env.APP_HOST}/list/genre/${genre.slug}`,
            lastmod: genre.updatedAt.toISOString(),
            changefreq: "monthly",
            priority: 0.8
        })
    }

    for (const author of authors) {
        sitemap.add({
            loc: `${process.env.APP_HOST}/list/author/${author.slug}`,
            lastmod: author.updatedAt.toISOString(),
            changefreq: "monthly",
            priority: 0.8
        })
    }


    writeFileSync(`${SITEMAP_PATH}/sitemap.xml`, sitemap.generate());

    console.log(`sitemap generated ${(new Date).toISOString()}`);


    if (parentPort) parentPort.postMessage('done');
    else process.exit(0);

}

generate()