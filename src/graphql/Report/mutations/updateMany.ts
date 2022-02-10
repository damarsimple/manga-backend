import { mutationField, nonNull } from 'nexus'

export const ReportUpdateManyMutation = mutationField('updateManyReport', {
  type: nonNull('BatchPayload'),
  args: {
    data: nonNull('ReportUpdateManyMutationInput'),
    where: 'ReportWhereInput',
  },
  resolve(_parent, args, { prisma }) {
    return prisma.report.updateMany(args as any)
  },
})
