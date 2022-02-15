import { queryField, nonNull } from 'nexus'

export const PerfomanceAnalyticFindUniqueQuery = queryField(
  'findUniquePerfomanceAnalytic',
  {
    type: 'PerfomanceAnalytic',
    args: {
      where: nonNull('PerfomanceAnalyticWhereUniqueInput'),
    },
    resolve(_parent, { where }, { prisma, select }) {
      return prisma.perfomanceAnalytic.findUnique({
        where,
        ...select,
      })
    },
  },
)
