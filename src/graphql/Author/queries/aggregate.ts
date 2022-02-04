import { queryField, list } from 'nexus'

export const AuthorAggregateQuery = queryField('aggregateAuthor', {
  type: 'AggregateAuthor',
  args: {
    where: 'AuthorWhereInput',
    orderBy: list('AuthorOrderByWithRelationInput'),
    cursor: 'AuthorWhereUniqueInput',
    take: 'Int',
    skip: 'Int',
  },
  resolve(_parent, args, { prisma, select }) {
    return prisma.author.aggregate({ ...args, ...select }) as any
  },
})
