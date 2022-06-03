import { objectType } from 'nexus'

export const Chapter = objectType({
  nonNullDefaults: {
    output: true,
    input: false,
  },
  name: 'Chapter',
  definition(t) {
    t.int('id')
    t.float('name')
    t.nullable.string('title')
    t.nullable.string('cdn')
    t.field('comic', {
      type: 'Comic',
      resolve(root: any) {
        return root.comic
      },
    })
    t.field('quality', { type: 'ChapterQuality' })
    t.int('views')
    t.int('imageCount')
    t.int('originalImageCount')
    t.boolean('processed')
    t.boolean('needOptimize')
    t.boolean('missing')
    t.nullable.string('batchs')
    t.list.string('imageUrls')
    t.nullable.json('imageDetails')
    t.field('createdAt', { type: 'DateTime' })
    t.field('updatedAt', { type: 'DateTime' })
    t.int('comicId')
    t.list.field('userviewers', {
      type: 'ViewedChapter',
      args: {
        where: 'ViewedChapterWhereInput',
        orderBy: 'ViewedChapterOrderByWithRelationInput',
        cursor: 'ViewedChapterWhereUniqueInput',
        take: 'Int',
        skip: 'Int',
        distinct: 'ViewedChapterScalarFieldEnum',
      },
      resolve(root: any) {
        return root.userviewers
      },
    })
    t.field('_count', {
      type: 'ChapterCountOutputType',
      resolve(root: any) {
        return root._count
      },
    })
  },
})
