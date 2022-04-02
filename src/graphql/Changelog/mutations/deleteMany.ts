import { mutationField, nonNull } from 'nexus'

export const ChangelogDeleteManyMutation = mutationField(
  'deleteManyChangelog',
  {
    type: nonNull('BatchPayload'),
    args: {
      where: 'ChangelogWhereInput',
    },
    resolve: async (_parent, { where }, { prisma }) => {
      return prisma.changelog.deleteMany({ where } as any)
    },
  },
)
