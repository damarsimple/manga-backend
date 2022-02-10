import { queryField, list } from 'nexus'

export const ChapterBookmarkAggregateQuery = queryField(
  'aggregateChapterBookmark',
  {
    type: 'AggregateChapterBookmark',
    args: {
      where: 'ChapterBookmarkWhereInput',
      orderBy: list('ChapterBookmarkOrderByWithRelationInput'),
      cursor: 'ChapterBookmarkWhereUniqueInput',
      take: 'Int',
      skip: 'Int',
    },
    resolve(_parent, args, { prisma, select }) {
      return prisma.chapterBookmark.aggregate({ ...args, ...select }) as any
    },
  },
)
