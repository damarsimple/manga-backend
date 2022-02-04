import { mutationField, nonNull } from 'nexus'

export const GenreCreateOneMutation = mutationField('createOneGenre', {
  type: nonNull('Genre'),
  args: {
    data: nonNull('GenreCreateInput'),
  },
  resolve(_parent, { data }, { prisma, select }) {
    return prisma.genre.create({
      data,
      ...select,
    })
  },
})
