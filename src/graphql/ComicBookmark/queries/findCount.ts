import { queryField, nonNull, list } from 'nexus'

export const ComicBookmarkFindCountQuery = queryField(
  'findManyComicBookmarkCount',
  {
    type: nonNull('Int'),
    args: {
      where: 'ComicBookmarkWhereInput',
      orderBy: list('ComicBookmarkOrderByWithRelationInput'),
      cursor: 'ComicBookmarkWhereUniqueInput',
      take: 'Int',
      skip: 'Int',
      distinct: list('ComicBookmarkScalarFieldEnum'),
    },
    resolve(_parent, args, { prisma }) {
      return prisma.comicBookmark.count(args as any)
    },
  },
)
