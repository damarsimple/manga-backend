import { queryField, list } from 'nexus'

export const MissingFindFirstQuery = queryField('findFirstMissing', {
  type: 'Missing',
  args: {
    where: 'MissingWhereInput',
    orderBy: list('MissingOrderByWithRelationInput'),
    cursor: 'MissingWhereUniqueInput',
    take: 'Int',
    skip: 'Int',
    distinct: list('MissingScalarFieldEnum'),
  },
  resolve(_parent, args, { prisma, select }) {
    return prisma.missing.findFirst({
      ...args,
      ...select,
    })
  },
})
