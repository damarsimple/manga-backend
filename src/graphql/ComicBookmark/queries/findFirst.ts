import { queryField, list } from 'nexus'

export const ComicBookmarkFindFirstQuery = queryField(
  'findFirstComicBookmark',
  {
    type: 'ComicBookmark',
    args: {
      where: 'ComicBookmarkWhereInput',
      orderBy: list('ComicBookmarkOrderByWithRelationInput'),
      cursor: 'ComicBookmarkWhereUniqueInput',
      take: 'Int',
      skip: 'Int',
      distinct: list('ComicBookmarkScalarFieldEnum'),
    },
    resolve(_parent, args, { prisma, select }) {
      return prisma.comicBookmark.findFirst({
        ...args,
        ...select,
      })
    },
  },
)
