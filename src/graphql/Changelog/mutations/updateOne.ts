import { mutationField, nonNull } from 'nexus'

export const ChangelogUpdateOneMutation = mutationField('updateOneChangelog', {
  type: nonNull('Changelog'),
  args: {
    data: nonNull('ChangelogUpdateInput'),
    where: nonNull('ChangelogWhereUniqueInput'),
  },
  resolve(_parent, { data, where }, { prisma, select }) {
    return prisma.changelog.update({
      where,
      data,
      ...select,
    })
  },
})
