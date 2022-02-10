import { mutationField, nonNull } from 'nexus'

export const ReportUpsertOneMutation = mutationField('upsertOneReport', {
  type: nonNull('Report'),
  args: {
    where: nonNull('ReportWhereUniqueInput'),
    create: nonNull('ReportCreateInput'),
    update: nonNull('ReportUpdateInput'),
  },
  resolve(_parent, args, { prisma, select }) {
    return prisma.report.upsert({
      ...args,
      ...select,
    })
  },
})
