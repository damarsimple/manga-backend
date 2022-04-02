import { mutationField, nonNull } from 'nexus'

export const ChangelogCreateOneMutation = mutationField('createOneChangelog', {
  type: nonNull('Changelog'),
  args: {
    data: nonNull('ChangelogCreateInput'),
  },
  resolve(_parent, { data }, { prisma, select }) {
    return prisma.changelog.create({
      data,
      ...select,
    })
  },
})
