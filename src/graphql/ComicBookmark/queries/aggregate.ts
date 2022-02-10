import { queryField, list } from 'nexus'

export const ComicBookmarkAggregateQuery = queryField(
  'aggregateComicBookmark',
  {
    type: 'AggregateComicBookmark',
    args: {
      where: 'ComicBookmarkWhereInput',
      orderBy: list('ComicBookmarkOrderByWithRelationInput'),
      cursor: 'ComicBookmarkWhereUniqueInput',
      take: 'Int',
      skip: 'Int',
    },
    resolve(_parent, args, { prisma, select }) {
      return prisma.comicBookmark.aggregate({ ...args, ...select }) as any
    },
  },
)
