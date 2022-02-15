import { queryField, nonNull, list } from 'nexus'

export const PerfomanceAnalyticFindManyQuery = queryField(
  'findManyPerfomanceAnalytic',
  {
    type: nonNull(list(nonNull('PerfomanceAnalytic'))),
    args: {
      where: 'PerfomanceAnalyticWhereInput',
      orderBy: list('PerfomanceAnalyticOrderByWithRelationInput'),
      cursor: 'PerfomanceAnalyticWhereUniqueInput',
      take: 'Int',
      skip: 'Int',
      distinct: list('PerfomanceAnalyticScalarFieldEnum'),
    },
    resolve(_parent, args, { prisma, select }) {
      return prisma.perfomanceAnalytic.findMany({
        ...args,
        ...select,
      })
    },
  },
)
