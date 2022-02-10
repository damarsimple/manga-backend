import { mutationField, nonNull } from 'nexus'

export const ReportDeleteManyMutation = mutationField('deleteManyReport', {
  type: nonNull('BatchPayload'),
  args: {
    where: 'ReportWhereInput',
  },
  resolve: async (_parent, { where }, { prisma }) => {
    return prisma.report.deleteMany({ where } as any)
  },
})
