import { mutationField, nonNull } from 'nexus'

export const GenreDeleteManyMutation = mutationField('deleteManyGenre', {
  type: nonNull('BatchPayload'),
  args: {
    where: 'GenreWhereInput',
  },
  resolve: async (_parent, { where }, { prisma }) => {
    return prisma.genre.deleteMany({ where } as any)
  },
})
