import { queryField, list } from 'nexus'

export const ComicFindFirstQuery = queryField('findFirstComic', {
  type: 'Comic',
  args: {
    where: 'ComicWhereInput',
    orderBy: list('ComicOrderByWithRelationInput'),
    cursor: 'ComicWhereUniqueInput',
    take: 'Int',
    skip: 'Int',
    distinct: list('ComicScalarFieldEnum'),
  },
  resolve(_parent, args, { prisma, select }) {
    return prisma.comic.findFirst({
      ...args,
      ...select,
    })
  },
})
