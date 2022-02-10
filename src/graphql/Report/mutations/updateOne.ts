import { mutationField, nonNull } from 'nexus'

export const ReportUpdateOneMutation = mutationField('updateOneReport', {
  type: nonNull('Report'),
  args: {
    data: nonNull('ReportUpdateInput'),
    where: nonNull('ReportWhereUniqueInput'),
  },
  resolve(_parent, { data, where }, { prisma, select }) {
    return prisma.report.update({
      where,
      data,
      ...select,
    })
  },
})
