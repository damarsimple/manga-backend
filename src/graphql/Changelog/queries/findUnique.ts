import { queryField, nonNull } from 'nexus'

export const ChangelogFindUniqueQuery = queryField('findUniqueChangelog', {
  type: 'Changelog',
  args: {
    where: nonNull('ChangelogWhereUniqueInput'),
  },
  resolve(_parent, { where }, { prisma, select }) {
    return prisma.changelog.findUnique({
      where,
      ...select,
    })
  },
})
