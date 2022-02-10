import { mutationField, nonNull } from 'nexus'

export const ReportDeleteOneMutation = mutationField('deleteOneReport', {
  type: 'Report',
  args: {
    where: nonNull('ReportWhereUniqueInput'),
  },
  resolve: async (_parent, { where }, { prisma, select }) => {
    return prisma.report.delete({
      where,
      ...select,
    })
  },
})
