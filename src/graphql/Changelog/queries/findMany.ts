import { queryField, nonNull, list } from 'nexus'

export const ChangelogFindManyQuery = queryField('findManyChangelog', {
  type: nonNull(list(nonNull('Changelog'))),
  args: {
    where: 'ChangelogWhereInput',
    orderBy: list('ChangelogOrderByWithRelationInput'),
    cursor: 'ChangelogWhereUniqueInput',
    take: 'Int',
    skip: 'Int',
    distinct: list('ChangelogScalarFieldEnum'),
  },
  resolve(_parent, args, { prisma, select }) {
    return prisma.changelog.findMany({
      ...args,
      ...select,
    })
  },
})
