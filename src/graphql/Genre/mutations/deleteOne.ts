import { mutationField, nonNull } from 'nexus'

export const GenreDeleteOneMutation = mutationField('deleteOneGenre', {
  type: 'Genre',
  args: {
    where: nonNull('GenreWhereUniqueInput'),
  },
  resolve: async (_parent, { where }, { prisma, select }) => {
    return prisma.genre.delete({
      where,
      ...select,
    })
  },
})
