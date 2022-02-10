import { mutationField, nonNull } from 'nexus'

export const ComicBookmarkDeleteOneMutation = mutationField(
  'deleteOneComicBookmark',
  {
    type: 'ComicBookmark',
    args: {
      where: nonNull('ComicBookmarkWhereUniqueInput'),
    },
    resolve: async (_parent, { where }, { prisma, select }) => {
      return prisma.comicBookmark.delete({
        where,
        ...select,
      })
    },
  },
)
