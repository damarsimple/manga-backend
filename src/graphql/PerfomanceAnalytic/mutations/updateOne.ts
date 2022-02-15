import { mutationField, nonNull } from 'nexus'

export const PerfomanceAnalyticUpdateOneMutation = mutationField(
  'updateOnePerfomanceAnalytic',
  {
    type: nonNull('PerfomanceAnalytic'),
    args: {
      data: nonNull('PerfomanceAnalyticUpdateInput'),
      where: nonNull('PerfomanceAnalyticWhereUniqueInput'),
    },
    resolve(_parent, { data, where }, { prisma, select }) {
      return prisma.perfomanceAnalytic.update({
        where,
        data,
        ...select,
      })
    },
  },
)
