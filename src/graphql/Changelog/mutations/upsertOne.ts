import { mutationField, nonNull } from 'nexus'

export const ChangelogUpsertOneMutation = mutationField('upsertOneChangelog', {
  type: nonNull('Changelog'),
  args: {
    where: nonNull('ChangelogWhereUniqueInput'),
    create: nonNull('ChangelogCreateInput'),
    update: nonNull('ChangelogUpdateInput'),
  },
  resolve(_parent, args, { prisma, select }) {
    return prisma.changelog.upsert({
      ...args,
      ...select,
    })
  },
})
