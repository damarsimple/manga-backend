import { queryField, nonNull, list } from 'nexus'

export const ReportFindCountQuery = queryField('findManyReportCount', {
  type: nonNull('Int'),
  args: {
    where: 'ReportWhereInput',
    orderBy: list('ReportOrderByWithRelationInput'),
    cursor: 'ReportWhereUniqueInput',
    take: 'Int',
    skip: 'Int',
    distinct: list('ReportScalarFieldEnum'),
  },
  resolve(_parent, args, { prisma }) {
    return prisma.report.count(args as any)
  },
})
