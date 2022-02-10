import { queryField, list } from 'nexus'

export const ReportAggregateQuery = queryField('aggregateReport', {
  type: 'AggregateReport',
  args: {
    where: 'ReportWhereInput',
    orderBy: list('ReportOrderByWithRelationInput'),
    cursor: 'ReportWhereUniqueInput',
    take: 'Int',
    skip: 'Int',
  },
  resolve(_parent, args, { prisma, select }) {
    return prisma.report.aggregate({ ...args, ...select }) as any
  },
})
