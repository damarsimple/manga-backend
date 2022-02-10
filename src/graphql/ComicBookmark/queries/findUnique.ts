import { queryField, nonNull } from 'nexus'

export const ComicBookmarkFindUniqueQuery = queryField(
  'findUniqueComicBookmark',
  {
    type: 'ComicBookmark',
    args: {
      where: nonNull('ComicBookmarkWhereUniqueInput'),
    },
    resolve(_parent, { where }, { prisma, select }) {
      return prisma.comicBookmark.findUnique({
        where,
        ...select,
      })
    },
  },
)
