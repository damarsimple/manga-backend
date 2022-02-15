import { mutationField, nonNull } from 'nexus'

export const PerfomanceAnalyticDeleteOneMutation = mutationField(
  'deleteOnePerfomanceAnalytic',
  {
    type: 'PerfomanceAnalytic',
    args: {
      where: nonNull('PerfomanceAnalyticWhereUniqueInput'),
    },
    resolve: async (_parent, { where }, { prisma, select }) => {
      return prisma.perfomanceAnalytic.delete({
        where,
        ...select,
      })
    },
  },
)
