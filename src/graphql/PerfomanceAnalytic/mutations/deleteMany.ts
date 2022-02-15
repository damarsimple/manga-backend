import { mutationField, nonNull } from 'nexus'

export const PerfomanceAnalyticDeleteManyMutation = mutationField(
  'deleteManyPerfomanceAnalytic',
  {
    type: nonNull('BatchPayload'),
    args: {
      where: 'PerfomanceAnalyticWhereInput',
    },
    resolve: async (_parent, { where }, { prisma }) => {
      return prisma.perfomanceAnalytic.deleteMany({ where } as any)
    },
  },
)
