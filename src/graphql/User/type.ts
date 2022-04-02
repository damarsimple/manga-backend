import { objectType } from 'nexus'

export const User = objectType({
  nonNullDefaults: {
    output: true,
    input: false,
  },
  name: 'User',
  definition(t) {
    t.int('id')
    t.string('email')
    t.nullable.string('name')
    t.boolean('isAdmin')
    t.boolean('allowHentai')
    t.string('password')
    t.field('createdAt', { type: 'DateTime' })
    t.field('updatedAt', { type: 'DateTime' })
    t.list.field('reports', {
      type: 'Report',
      args: {
        where: 'ReportWhereInput',
        orderBy: 'ReportOrderByWithRelationInput',
        cursor: 'ReportWhereUniqueInput',
        take: 'Int',
        skip: 'Int',
        distinct: 'ReportScalarFieldEnum',
      },
      resolve(root: any) {
        return root.reports
      },
    })
    t.list.field('comicbookmarks', {
      type: 'ComicBookmark',
      args: {
        where: 'ComicBookmarkWhereInput',
        orderBy: 'ComicBookmarkOrderByWithRelationInput',
        cursor: 'ComicBookmarkWhereUniqueInput',
        take: 'Int',
        skip: 'Int',
        distinct: 'ComicBookmarkScalarFieldEnum',
      },
      resolve(root: any) {
        return root.comicbookmarks
      },
    })
    t.list.field('viewedChapters', {
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
        return root.viewedChapters
      },
    })
    t.list.field('changelogs', {
      type: 'Changelog',
      args: {
        where: 'ChangelogWhereInput',
        orderBy: 'ChangelogOrderByWithRelationInput',
        cursor: 'ChangelogWhereUniqueInput',
        take: 'Int',
        skip: 'Int',
        distinct: 'ChangelogScalarFieldEnum',
      },
      resolve(root: any) {
        return root.changelogs
      },
    })
    t.field('_count', {
      type: 'UserCountOutputType',
      resolve(root: any) {
        return root._count
      },
    })
  },
})
