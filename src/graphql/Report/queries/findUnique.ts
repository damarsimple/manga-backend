import { queryField, nonNull } from 'nexus'

export const ReportFindUniqueQuery = queryField('findUniqueReport', {
  type: 'Report',
  args: {
    where: nonNull('ReportWhereUniqueInput'),
  },
  resolve(_parent, { where }, { prisma, select }) {
    return prisma.report.findUnique({
      where,
      ...select,
    })
  },
})
