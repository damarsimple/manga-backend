import { queryField, nonNull } from 'nexus'

export const GenreFindUniqueQuery = queryField('findUniqueGenre', {
  type: 'Genre',
  args: {
    where: nonNull('GenreWhereUniqueInput'),
  },
  resolve(_parent, { where }, { prisma, select }) {
    return prisma.genre.findUnique({
      where,
      ...select,
    })
  },
})
