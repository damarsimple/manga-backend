import { mutationField, nonNull } from 'nexus'

export const MissingUpdateManyMutation = mutationField('updateManyMissing', {
  type: nonNull('BatchPayload'),
  args: {
    data: nonNull('MissingUpdateManyMutationInput'),
    where: 'MissingWhereInput',
  },
  resolve(_parent, args, { prisma }) {
    return prisma.missing.updateMany(args as any)
  },
})
