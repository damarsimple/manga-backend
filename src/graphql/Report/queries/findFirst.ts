import { queryField, list } from 'nexus'

export const ReportFindFirstQuery = queryField('findFirstReport', {
  type: 'Report',
  args: {
    where: 'ReportWhereInput',
    orderBy: list('ReportOrderByWithRelationInput'),
    cursor: 'ReportWhereUniqueInput',
    take: 'Int',
    skip: 'Int',
    distinct: list('ReportScalarFieldEnum'),
  },
  resolve(_parent, args, { prisma, select }) {
    return prisma.report.findFirst({
      ...args,
      ...select,
    })
  },
})
