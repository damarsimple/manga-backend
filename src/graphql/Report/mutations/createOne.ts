import { mutationField, nonNull } from 'nexus'

export const ReportCreateOneMutation = mutationField('createOneReport', {
  type: nonNull('Report'),
  args: {
    data: nonNull('ReportCreateInput'),
  },
  resolve(_parent, { data }, { prisma, select }) {
    return prisma.report.create({
      data,
      ...select,
    })
  },
})
