import { queryField, list } from 'nexus'

export const ViewedChapterAggregateQuery = queryField(
  'aggregateViewedChapter',
  {
    type: 'AggregateViewedChapter',
    args: {
      where: 'ViewedChapterWhereInput',
      orderBy: list('ViewedChapterOrderByWithRelationInput'),
      cursor: 'ViewedChapterWhereUniqueInput',
      take: 'Int',
      skip: 'Int',
    },
    resolve(_parent, args, { prisma, select }) {
      return prisma.viewedChapter.aggregate({ ...args, ...select }) as any
    },
  },
)
