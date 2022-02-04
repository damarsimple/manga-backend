import { mutationField, nonNull } from 'nexus'

export const GenreUpdateManyMutation = mutationField('updateManyGenre', {
  type: nonNull('BatchPayload'),
  args: {
    data: nonNull('GenreUpdateManyMutationInput'),
    where: 'GenreWhereInput',
  },
  resolve(_parent, args, { prisma }) {
    return prisma.genre.updateMany(args as any)
  },
})
