import { queryField, list } from 'nexus'

export const GenreAggregateQuery = queryField('aggregateGenre', {
  type: 'AggregateGenre',
  args: {
    where: 'GenreWhereInput',
    orderBy: list('GenreOrderByWithRelationInput'),
    cursor: 'GenreWhereUniqueInput',
    take: 'Int',
    skip: 'Int',
  },
  resolve(_parent, args, { prisma, select }) {
    return prisma.genre.aggregate({ ...args, ...select }) as any
  },
})
