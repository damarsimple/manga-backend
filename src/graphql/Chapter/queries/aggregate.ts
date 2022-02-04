import { queryField, list } from 'nexus'

export const ChapterAggregateQuery = queryField('aggregateChapter', {
  type: 'AggregateChapter',
  args: {
    where: 'ChapterWhereInput',
    orderBy: list('ChapterOrderByWithRelationInput'),
    cursor: 'ChapterWhereUniqueInput',
    take: 'Int',
    skip: 'Int',
  },
  resolve(_parent, args, { prisma, select }) {
    return prisma.chapter.aggregate({ ...args, ...select }) as any
  },
})
