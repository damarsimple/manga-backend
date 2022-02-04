import { queryField, nonNull, list } from 'nexus'

export const GenreFindCountQuery = queryField('findManyGenreCount', {
  type: nonNull('Int'),
  args: {
    where: 'GenreWhereInput',
    orderBy: list('GenreOrderByWithRelationInput'),
    cursor: 'GenreWhereUniqueInput',
    take: 'Int',
    skip: 'Int',
    distinct: list('GenreScalarFieldEnum'),
  },
  resolve(_parent, args, { prisma }) {
    return prisma.genre.count(args as any)
  },
})
