import { mutationField, nonNull } from 'nexus'

export const ChangelogDeleteOneMutation = mutationField('deleteOneChangelog', {
  type: 'Changelog',
  args: {
    where: nonNull('ChangelogWhereUniqueInput'),
  },
  resolve: async (_parent, { where }, { prisma, select }) => {
    return prisma.changelog.delete({
      where,
      ...select,
    })
  },
})
