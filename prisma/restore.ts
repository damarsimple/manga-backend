import glob from "glob";
import { readFileSync } from "fs";
import moment from "moment";
import { slugify } from "../src/modules/Helper";
import { prisma } from "../src/modules/Context";
async function main() {
    const files = glob.sync("./backup/**.json")
    console.log(files)
    for (const bruh of files) {

        const test = JSON.parse(readFileSync(bruh, 'utf-8'));

        for (const x of test) {

            try {
                const comic = await prisma.comic.create({
                    data: {
                        name: x.name,
                        slug: `${x.slug}`.trim(),
                        description: x.description,
                        age: x.age,
                        isHentai: Boolean(x.is_hentai),
                        altName: x.alt_name ?? undefined,
                        released: moment(x.released).toDate(),
                        views: x.views,
                        rating: x.rating,
                        type: x.type ?? "unkown",
                        concept: x.concept,
                        lastChapterUpdateAt: x.last_chapter_update_at,
                        viewsWeek: x.views_week,
                        thumb: x.thumb,
                        thumbWide: x.thumb_wide,
                        author: {
                            connectOrCreate: {
                                where: {
                                    slug: slugify(x.author.name ?? "N/A",),
                                },
                                create: {
                                    name: x.author.name ?? "N/A",
                                    slug: slugify(x.author.name ?? "N/A",),
                                },
                            },
                        },
                        genres: {
                            connectOrCreate: x.genres.map((e: any) => ({
                                where: {
                                    slug: slugify(e.name ?? "N/A",),
                                },
                                create: {
                                    name: e.name ?? "N/A",
                                    slug: slugify(e.name) ?? "N/A",
                                }
                            }))
                        },
                        chapters: {
                            create: x.chapters_all.map((e: any) => ({
                                name: e.name,
                                imageUrls: e.images.map((e: any) => e.image_full_path),
                                processed: true,
                                id: e.id
                            }))
                        },

                    }
                })
                console.log(`created ${comic.name}`)

            } catch (error) {

                const check = await prisma.comic.findFirst({
                    where: {
                        slug: `${x.slug}`.trim()
                    }
                })


                const check2 = await prisma.comic.findFirst({
                    where: {
                        name: `${x.name}`
                    }
                })



                if (!check2 || !check) {
                    console.log(`${bruh} check2   ${check?.id} ${check2?.slug}`)
                    console.error(error);
                }

            }


        }

    }





    // const author = await prisma.author.create({
    //     data: {
    //         name: "test12",
    //         slug: "test12"
    //     }
    // })

    // await prisma.genre.createMany({
    //     data: [...Array(10)].map((e, i) => ({
    //         name: `test saga ${i}`,
    //         slug: `test-saga-${i}`,
    //     }))
    // })

    // const genres = await prisma.genre.findMany();

    // await prisma.comic.createMany({
    //     data: [...Array(10)].map((_, i) => ({
    //         authorId: author.id,

    //         name: `test saga-${i}`,
    //         slug: `test-saga-${i}`,

    //     }))
    // })



    // for (const x of await prisma.comic.findMany()) {
    //     await prisma.chapter.createMany({
    //         data: [...Array(100)].map(e => ({
    //             comicId: x.id,
    //             name: 1.1,
    //             imageUrls: ["test"],
    //             title: "test",
    //         }))
    //     })

    //     await prisma.comic.update({
    //         where: {
    //             id: x.id
    //         },
    //         data: {
    //             genres: {
    //                 connect: genres.map(e => ({ id: e.id }))
    //             }
    //         }
    //     })

    // }

}

main()
