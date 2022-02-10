import { Chapter } from '@prisma/client';
import moment from 'moment';
import { arg, extendType, list, nonNull, stringArg, objectType, intArg } from 'nexus';
import BunnyCDN from '../modules/BunnyCDN';
import { slugify } from '../modules/Helper';
import { comicIncrementQueue } from '../modules/Queue';
import { updateDocumentIndex } from '../modules/Meilisearch';

export const SanityCheck = objectType({
  name: 'SanityCheck',
  definition(t) {
    t.string('status')
    t.list.field('chapters', { type: 'Chapter' })
  }
})

export const ComicRelated = extendType({
  type: 'Mutation',
  definition(t) {

    t.field('reportView', {
      type: 'Boolean',
      args: {
        id: nonNull(intArg())
      },
      resolve: async (_, { id }, __) => {

        const date = new Date().getTime();


        comicIncrementQueue.add('increment', { id })

        console.log(`finish at ${new Date().getTime() - date}`);


        return true
      }
    })

    t.field('sanityEclipse', {
      type: 'Boolean',
      authorize: (_, __, ctx) => ctx.gotKey,
      args: {
        name: nonNull(stringArg()),
        chapter: arg({ type: 'JSONObject' }),
      },
      resolve: async (_, { name, chapter }, ctx) => {
        const comic = await ctx.prisma.comic.findFirst({
          where: {
            slug: slugify(name)
          },
          include: {
            chapters: true
          }
        });

        if (!comic) {
          console.log(`${slugify(name)} not found`);

          return false
        };


        const chaps = comic.chapters.map(e => e.name);

        if (chaps.includes(chapter.name)) {
          console.log(`${slugify(name)} chapter ${chapter.name} already exists`);
          return false
        }


        await ctx.prisma.chapter.create({
          data: {
            name: chapter.name,
            imageUrls: chapter.imageUrls,
            comicId: comic.id
          }
        });



        const updateRes = await ctx.prisma.comic.update({
          where: {
            id: comic.id
          },
          data: {
            lastChapterUpdateAt: new Date(),

          }
        })

        await updateDocumentIndex(comic.id, "comics", updateRes)

        return true


      },
    })

    t.field('sanityCheck', {
      type: 'SanityCheck',
      args: {
        name: nonNull(stringArg()),
        thumb: nonNull(stringArg()),
        author: nonNull(stringArg()),
        thumbWide: stringArg(),
        description: stringArg(),
        released: stringArg(),
        type: stringArg(),
        genres: list(stringArg()),
      },
      authorize: (_, __, ctx) => ctx.gotKey,
      //@ts-ignore
      resolve: async (_, comicData, ctx) => {
        let comic = await ctx.prisma.comic.findFirst({
          where: {
            slug: slugify(comicData.name)
          },
          include: {
            chapters: true
          }
        });


        if (!comic) {
          const { genres, released: candidate, author, thumb, thumbWide, ...data } = comicData

          const slug = slugify(comicData.name)

          const bunny = new BunnyCDN();

          let released;

          try {
            released = moment(candidate).toDate();
          } catch (error) {
            released = moment().toDate();
          }



          try {
            const comicNew = await ctx.prisma.comic.create({
              data: {
                //@ts-ignore
                type: comicData.type == "" ? "n/a" : comicData.type as string,
                ...data,
                released,
                slug,
                thumb: `https://cdn.gudangkomik.com/${slug}/thumb.jpg`,
                thumbWide: `https://cdn.gudangkomik.com/${slug}/thumbWide.jpg`,
                author: {
                  connectOrCreate: {
                    where: {
                      slug: slugify(author),
                    },
                    create: {
                      name: author,
                      slug: slugify(author),
                    },
                  }
                },
                genres: {
                  connectOrCreate: (genres ?? []).map((e: any) => ({
                    where: {
                      slug: slugify(e ?? "N/A",),
                    },
                    create: {
                      name: e ?? "N/A",
                      slug: slugify(e) ?? "N/A",
                    }
                  }))
                },
              },


            });

            await updateDocumentIndex(comicNew.id, "comics", comicNew)


          } catch (error) {
            console.error(error)
          }



          return {
            status: "new",
            chapters: []
          }

        }

        return {
          status: "old",
          chapters: comic.chapters
        }

      }
    })

  }
})
