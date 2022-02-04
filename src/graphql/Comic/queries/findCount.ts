import { queryField, nonNull, list } from 'nexus'

export const ComicFindCountQuery = queryField('findManyComicCount', {
  type: nonNull('Int'),
  args: {
    where: 'ComicWhereInput',
    orderBy: list('ComicOrderByWithRelationInput'),
    cursor: 'ComicWhereUniqueInput',
    take: 'Int',
    skip: 'Int',
    distinct: list('ComicScalarFieldEnum'),
  },
  resolve(_parent, args, { prisma }) {
    return prisma.comic.count(args as any)
  },
})
