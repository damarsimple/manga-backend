import { Chapter, Comic, Author } from '@prisma/client';
import moment from 'moment';
import { arg, extendType, list, nonNull, stringArg, objectType, intArg, booleanArg, floatArg } from 'nexus';
import BunnyCDN from '../modules/BunnyCDN';
import { slugify } from '../modules/Helper';
import { comicIncrementQueue, chapterIncrementQueue } from '../modules/Queue';
import { updateDocumentIndex } from '../modules/Meilisearch';
import { connection } from '../modules/Redis';

export const SanityCheck = objectType({
  name: 'SanityCheck',
  definition(t) {
    t.string('status')
    t.list.field('chapters', { type: 'Chapter' })
  }
})
export const SanityEclipse = objectType({
  name: 'SanityEclipse',
  definition(t) {
    t.boolean('status')
    t.nullable.string('message')
  }
})


export const ComicSearch = objectType({
  name: 'ComicSearch',
  definition(t) {
    t.list.field('comics', { type: 'Comic' })
    t.int('offset')
    t.int('limit')
    t.int('processingTimeMs')
    t.int('total')
    t.boolean('exhaustiveNbHits')
  }
})

export const AuthorSearch = objectType({
  name: 'AuthorSearch',
  definition(t) {
    t.list.field('authors', { type: 'Author' })
    t.int('offset')
    t.int('limit')
    t.int('processingTimeMs')
    t.int('total')
    t.boolean('exhaustiveNbHits')
  }
})

export const GenreSearch = objectType({
  name: 'GenreSearch',
  definition(t) {
    t.list.field('authors', { type: 'Genre' })
    t.int('offset')
    t.int('limit')
    t.int('processingTimeMs')
    t.int('total')
    t.boolean('exhaustiveNbHits')
  }
})


export const ComicQueryRelated = extendType({
  type: 'Query',
  definition(t) {

    t.field('comicSearch', {
      type: ComicSearch,
      args: {
        query: nonNull(stringArg()),
        offset: intArg(),
        limit: intArg(),
        type: stringArg(),
        allowHentai: booleanArg({ default: false })
      },
      resolve: async (_, {
        query, offset, limit, type,
        allowHentai
      }, { comicsIndex }) => {



        console.log(`search called with liit of ${limit} and query of ${query} `)

        const filters = [];

        if (type) {
          filters.push(`type = ${type}`)
        }

        if (!allowHentai) {
          filters.push(`isHentai = false`)
        }

        let filter = filters.join(" AND ")


        if (limit == 10000) {
          const key = `comicSearchAll`

          const cache = await connection.get(key)

          if (!cache) {
            const save = await comicsIndex.search<Comic>(query, {
              attributesToHighlight: ["name", "author", "description"],
              limit: limit,
              sort: [
                "lastChapterUpdatedAt:desc"
              ]
            });

            await connection.set(key, JSON.stringify(save));

            return {
              ...save,
              total: save.nbHits,
              comics: save.hits.map(e => e._formatted as Comic)
            }
          }
          const data = JSON.parse(cache)
          return {
            ...data,
            total: data.nbHits,
            //@ts-ignore
            comics: data.hits.map(e => e._formatted as Comic)
          }


        }

        const result = await comicsIndex.search<Comic>(query, {
          attributesToHighlight: ["name", "author", "description"],
          offset: offset ?? 0,
          limit: limit ?? 10,
          filter: filter.length > 0 ? filter : undefined,
          sort: [
            "lastChapterUpdatedAt:desc"
          ]
        });

        return {
          ...result,
          total: result.nbHits,
          comics: result.hits.map(e => e._formatted as Comic)
        }

      }
    });

    t.field('genreSearch', {
      type: AuthorSearch,
      args: {
        query: nonNull(stringArg()),
        offset: intArg(),
        limit: intArg(),
      },
      resolve: async (_, {
        query, offset, limit
      }, { authorsIndex }) => {

        const result = await authorsIndex.search<Author>(query, {
          attributesToHighlight: ["name",],
          offset: offset ?? 0,
          limit: limit ?? 10,
        });

        return {
          ...result,
          total: result.nbHits,
          comics: result.hits.map(e => e._formatted as Comic)
        }

      }
    });

    t.field('authorSearch', {
      type: AuthorSearch,
      args: {
        query: nonNull(stringArg()),
        offset: intArg(),
        limit: intArg(),
      },
      resolve: async (_, {
        query, offset, limit
      }, { authorsIndex }) => {

        const result = await authorsIndex.search<Author>(query, {
          attributesToHighlight: ["name",],
          offset: offset ?? 0,
          limit: limit ?? 10,
        });

        return {
          ...result,
          total: result.nbHits,
          comics: result.hits.map(e => e._formatted as Comic)
        }

      }
    });

  }
})


export const ComicMutationRelated = extendType({
  type: 'Mutation',
  definition(t) {

    t.field('reportMissing', {
      type: 'Boolean',
      args: {
        context: nonNull(stringArg()),
        data: nonNull(stringArg()),
      },
      resolve: async (_, { context, data }, {
        prisma
      }) => {

        let missing = await prisma.missing.findFirst({
          where: {
            context,
            data
          }
        })

        if (!missing) {
          missing = await prisma.missing.create({
            data: {
              context,
              data
            }
          })
        }

        return true
      }
    })

    t.field('reportView', {
      type: 'Boolean',
      args: {
        id: nonNull(intArg()),
        context: nonNull(stringArg())
      },
      resolve: async (_, { id, context }, __) => {


        if (context == "comic") {
          comicIncrementQueue.add('increment', { id })
        } else {
          chapterIncrementQueue.add('increment', { id })
        }


        return true
      }
    })

    t.field('sanityEclipse', {
      type: 'SanityEclipse',
      authorize: (_, __, ctx) => ctx.gotKey,
      args: {
        slug: nonNull(stringArg()),
        chapter: arg({ type: 'JSONObject' }),
      },
      resolve: async (_, { slug, chapter }, ctx) => {
        const comic = await ctx.prisma.comic.findFirst({
          where: {
            slug: slugify(slug)
          },
          include: {
            chapters: true
          }
        });

        if (!comic) {

          return {
            status: false,
            message: `${slugify(slug)} not found`
          }
        };


        const chaps = comic.chapters.map(e => e.name);

        if (chaps.includes(chapter.name)) {
          return {
            status: false,
            message: `${slugify(slug)} chapter ${chapter.name} already exists`
          }
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

        return {
          status: true,
          message: `${slugify(slug)} chapter ${chapter.name} added`
        }


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
