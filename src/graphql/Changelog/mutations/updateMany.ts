import { mutationField, nonNull } from 'nexus'

export const ChangelogUpdateManyMutation = mutationField(
  'updateManyChangelog',
  {
    type: nonNull('BatchPayload'),
    args: {
      data: nonNull('ChangelogUpdateManyMutationInput'),
      where: 'ChangelogWhereInput',
    },
    resolve(_parent, args, { prisma }) {
      return prisma.changelog.updateMany(args as any)
    },
  },
)
