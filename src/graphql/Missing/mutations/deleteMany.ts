import { mutationField, nonNull } from 'nexus'

export const MissingDeleteManyMutation = mutationField('deleteManyMissing', {
  type: nonNull('BatchPayload'),
  args: {
    where: 'MissingWhereInput',
  },
  resolve: async (_parent, { where }, { prisma }) => {
    return prisma.missing.deleteMany({ where } as any)
  },
})
