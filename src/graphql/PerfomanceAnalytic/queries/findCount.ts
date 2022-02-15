import { queryField, nonNull, list } from 'nexus'

export const PerfomanceAnalyticFindCountQuery = queryField(
  'findManyPerfomanceAnalyticCount',
  {
    type: nonNull('Int'),
    args: {
      where: 'PerfomanceAnalyticWhereInput',
      orderBy: list('PerfomanceAnalyticOrderByWithRelationInput'),
      cursor: 'PerfomanceAnalyticWhereUniqueInput',
      take: 'Int',
      skip: 'Int',
      distinct: list('PerfomanceAnalyticScalarFieldEnum'),
    },
    resolve(_parent, args, { prisma }) {
      return prisma.perfomanceAnalytic.count(args as any)
    },
  },
)
