import { queryField, list } from 'nexus'

export const MissingAggregateQuery = queryField('aggregateMissing', {
  type: 'AggregateMissing',
  args: {
    where: 'MissingWhereInput',
    orderBy: list('MissingOrderByWithRelationInput'),
    cursor: 'MissingWhereUniqueInput',
    take: 'Int',
    skip: 'Int',
  },
  resolve(_parent, args, { prisma, select }) {
    return prisma.missing.aggregate({ ...args, ...select }) as any
  },
})
