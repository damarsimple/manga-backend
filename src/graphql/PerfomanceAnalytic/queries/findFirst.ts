import { queryField, list } from 'nexus'

export const PerfomanceAnalyticFindFirstQuery = queryField(
  'findFirstPerfomanceAnalytic',
  {
    type: 'PerfomanceAnalytic',
    args: {
      where: 'PerfomanceAnalyticWhereInput',
      orderBy: list('PerfomanceAnalyticOrderByWithRelationInput'),
      cursor: 'PerfomanceAnalyticWhereUniqueInput',
      take: 'Int',
      skip: 'Int',
      distinct: list('PerfomanceAnalyticScalarFieldEnum'),
    },
    resolve(_parent, args, { prisma, select }) {
      return prisma.perfomanceAnalytic.findFirst({
        ...args,
        ...select,
      })
    },
  },
)
