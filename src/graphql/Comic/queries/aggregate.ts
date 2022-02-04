import { queryField, list } from 'nexus'

export const ComicAggregateQuery = queryField('aggregateComic', {
  type: 'AggregateComic',
  args: {
    where: 'ComicWhereInput',
    orderBy: list('ComicOrderByWithRelationInput'),
    cursor: 'ComicWhereUniqueInput',
    take: 'Int',
    skip: 'Int',
  },
  resolve(_parent, args, { prisma, select }) {
    return prisma.comic.aggregate({ ...args, ...select }) as any
  },
})
