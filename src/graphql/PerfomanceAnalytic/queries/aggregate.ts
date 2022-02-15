import { queryField, list } from 'nexus'

export const PerfomanceAnalyticAggregateQuery = queryField(
  'aggregatePerfomanceAnalytic',
  {
    type: 'AggregatePerfomanceAnalytic',
    args: {
      where: 'PerfomanceAnalyticWhereInput',
      orderBy: list('PerfomanceAnalyticOrderByWithRelationInput'),
      cursor: 'PerfomanceAnalyticWhereUniqueInput',
      take: 'Int',
      skip: 'Int',
    },
    resolve(_parent, args, { prisma, select }) {
      return prisma.perfomanceAnalytic.aggregate({ ...args, ...select }) as any
    },
  },
)
