import { queryField, nonNull, list } from 'nexus'

export const ChangelogFindCountQuery = queryField('findManyChangelogCount', {
  type: nonNull('Int'),
  args: {
    where: 'ChangelogWhereInput',
    orderBy: list('ChangelogOrderByWithRelationInput'),
    cursor: 'ChangelogWhereUniqueInput',
    take: 'Int',
    skip: 'Int',
    distinct: list('ChangelogScalarFieldEnum'),
  },
  resolve(_parent, args, { prisma }) {
    return prisma.changelog.count(args as any)
  },
})
