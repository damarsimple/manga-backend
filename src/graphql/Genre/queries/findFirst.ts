import { queryField, list } from 'nexus'

export const GenreFindFirstQuery = queryField('findFirstGenre', {
  type: 'Genre',
  args: {
    where: 'GenreWhereInput',
    orderBy: list('GenreOrderByWithRelationInput'),
    cursor: 'GenreWhereUniqueInput',
    take: 'Int',
    skip: 'Int',
    distinct: list('GenreScalarFieldEnum'),
  },
  resolve(_parent, args, { prisma, select }) {
    return prisma.genre.findFirst({
      ...args,
      ...select,
    })
  },
})
