import { objectType } from 'nexus'

export const Comic = objectType({
  nonNullDefaults: {
    output: true,
    input: false,
  },
  name: 'Comic',
  definition(t) {
    t.int('id')
    t.string('name')
    t.string('thumb')
    t.string('type')
    t.nullable.string('thumbWide')
    t.nullable.json('altName')
    t.string('slug')
    t.boolean('isHentai')
    t.field('released', { type: 'DateTime' })
    t.field('author', {
      type: 'Author',
      resolve(root: any) {
        return root.author
      },
    })
    t.float('rating')
    t.int('views')
    t.int('viewsWeek')
    t.nullable.string('description')
    t.nullable.string('status')
    t.nullable.string('age')
    t.nullable.string('concept')
    t.field('lastChapterUpdateAt', { type: 'DateTime' })
    t.field('createdAt', { type: 'DateTime' })
    t.field('updatedAt', { type: 'DateTime' })
    t.int('authorId')
    t.list.field('chapters', {
      type: 'Chapter',
      args: {
        where: 'ChapterWhereInput',
        orderBy: 'ChapterOrderByWithRelationInput',
        cursor: 'ChapterWhereUniqueInput',
        take: 'Int',
        skip: 'Int',
        distinct: 'ChapterScalarFieldEnum',
      },
      resolve(root: any) {
        return root.chapters
      },
    })
    t.list.field('genres', {
      type: 'Genre',
      args: {
        where: 'GenreWhereInput',
        orderBy: 'GenreOrderByWithRelationInput',
        cursor: 'GenreWhereUniqueInput',
        take: 'Int',
        skip: 'Int',
        distinct: 'GenreScalarFieldEnum',
      },
      resolve(root: any) {
        return root.genres
      },
    })
    t.field('_count', {
      type: 'ComicCountOutputType',
      resolve(root: any) {
        return root._count
      },
    })
  },
})
