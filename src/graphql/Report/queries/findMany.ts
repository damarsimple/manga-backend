import { queryField, nonNull, list } from 'nexus'

export const ReportFindManyQuery = queryField('findManyReport', {
  type: nonNull(list(nonNull('Report'))),
  args: {
    where: 'ReportWhereInput',
    orderBy: list('ReportOrderByWithRelationInput'),
    cursor: 'ReportWhereUniqueInput',
    take: 'Int',
    skip: 'Int',
    distinct: list('ReportScalarFieldEnum'),
  },
  resolve(_parent, args, { prisma, select }) {
    return prisma.report.findMany({
      ...args,
      ...select,
    })
  },
})
