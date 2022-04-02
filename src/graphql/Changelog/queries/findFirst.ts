import { queryField, list } from 'nexus'

export const ChangelogFindFirstQuery = queryField('findFirstChangelog', {
  type: 'Changelog',
  args: {
    where: 'ChangelogWhereInput',
    orderBy: list('ChangelogOrderByWithRelationInput'),
    cursor: 'ChangelogWhereUniqueInput',
    take: 'Int',
    skip: 'Int',
    distinct: list('ChangelogScalarFieldEnum'),
  },
  resolve(_parent, args, { prisma, select }) {
    return prisma.changelog.findFirst({
      ...args,
      ...select,
    })
  },
})
