import { mutationField, nonNull } from 'nexus'

export const GenreUpdateOneMutation = mutationField('updateOneGenre', {
  type: nonNull('Genre'),
  args: {
    data: nonNull('GenreUpdateInput'),
    where: nonNull('GenreWhereUniqueInput'),
  },
  resolve(_parent, { data, where }, { prisma, select }) {
    return prisma.genre.update({
      where,
      data,
      ...select,
    })
  },
})
