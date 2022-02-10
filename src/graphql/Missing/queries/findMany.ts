import { queryField, nonNull, list } from 'nexus'

export const MissingFindManyQuery = queryField('findManyMissing', {
  type: nonNull(list(nonNull('Missing'))),
  args: {
    where: 'MissingWhereInput',
    orderBy: list('MissingOrderByWithRelationInput'),
    cursor: 'MissingWhereUniqueInput',
    take: 'Int',
    skip: 'Int',
    distinct: list('MissingScalarFieldEnum'),
  },
  resolve(_parent, args, { prisma, select }) {
    return prisma.missing.findMany({
      ...args,
      ...select,
    })
  },
})
