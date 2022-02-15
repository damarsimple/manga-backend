import { mutationField, nonNull } from 'nexus'

export const PerfomanceAnalyticCreateOneMutation = mutationField(
  'createOnePerfomanceAnalytic',
  {
    type: nonNull('PerfomanceAnalytic'),
    args: {
      data: nonNull('PerfomanceAnalyticCreateInput'),
    },
    resolve(_parent, { data }, { prisma, select }) {
      return prisma.perfomanceAnalytic.create({
        data,
        ...select,
      })
    },
  },
)
