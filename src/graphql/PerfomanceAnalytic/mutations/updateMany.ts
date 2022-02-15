import { mutationField, nonNull } from 'nexus'

export const PerfomanceAnalyticUpdateManyMutation = mutationField(
  'updateManyPerfomanceAnalytic',
  {
    type: nonNull('BatchPayload'),
    args: {
      data: nonNull('PerfomanceAnalyticUpdateManyMutationInput'),
      where: 'PerfomanceAnalyticWhereInput',
    },
    resolve(_parent, args, { prisma }) {
      return prisma.perfomanceAnalytic.updateMany(args as any)
    },
  },
)
