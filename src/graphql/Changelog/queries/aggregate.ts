import { queryField, list } from 'nexus'

export const ChangelogAggregateQuery = queryField('aggregateChangelog', {
  type: 'AggregateChangelog',
  args: {
    where: 'ChangelogWhereInput',
    orderBy: list('ChangelogOrderByWithRelationInput'),
    cursor: 'ChangelogWhereUniqueInput',
    take: 'Int',
    skip: 'Int',
  },
  resolve(_parent, args, { prisma, select }) {
    return prisma.changelog.aggregate({ ...args, ...select }) as any
  },
})
