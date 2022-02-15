import { mutationField, nonNull } from 'nexus'

export const PerfomanceAnalyticUpsertOneMutation = mutationField(
  'upsertOnePerfomanceAnalytic',
  {
    type: nonNull('PerfomanceAnalytic'),
    args: {
      where: nonNull('PerfomanceAnalyticWhereUniqueInput'),
      create: nonNull('PerfomanceAnalyticCreateInput'),
      update: nonNull('PerfomanceAnalyticUpdateInput'),
    },
    resolve(_parent, args, { prisma, select }) {
      return prisma.perfomanceAnalytic.upsert({
        ...args,
        ...select,
      })
    },
  },
)
