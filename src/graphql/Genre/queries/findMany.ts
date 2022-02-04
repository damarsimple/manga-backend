import { queryField, nonNull, list } from 'nexus'

export const GenreFindManyQuery = queryField('findManyGenre', {
  type: nonNull(list(nonNull('Genre'))),
  args: {
    where: 'GenreWhereInput',
    orderBy: list('GenreOrderByWithRelationInput'),
    cursor: 'GenreWhereUniqueInput',
    take: 'Int',
    skip: 'Int',
    distinct: list('GenreScalarFieldEnum'),
  },
  resolve(_parent, args, { prisma, select }) {
    return prisma.genre.findMany({
      ...args,
      ...select,
    })
  },
})
