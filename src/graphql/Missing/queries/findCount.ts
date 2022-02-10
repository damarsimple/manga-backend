import { queryField, nonNull, list } from 'nexus'

export const MissingFindCountQuery = queryField('findManyMissingCount', {
  type: nonNull('Int'),
  args: {
    where: 'MissingWhereInput',
    orderBy: list('MissingOrderByWithRelationInput'),
    cursor: 'MissingWhereUniqueInput',
    take: 'Int',
    skip: 'Int',
    distinct: list('MissingScalarFieldEnum'),
  },
  resolve(_parent, args, { prisma }) {
    return prisma.missing.count(args as any)
  },
})
