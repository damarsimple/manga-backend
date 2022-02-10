import { mutationField, nonNull } from 'nexus'

export const ComicBookmarkUpdateOneMutation = mutationField(
  'updateOneComicBookmark',
  {
    type: nonNull('ComicBookmark'),
    args: {
      data: nonNull('ComicBookmarkUpdateInput'),
      where: nonNull('ComicBookmarkWhereUniqueInput'),
    },
    resolve(_parent, { data, where }, { prisma, select }) {
      return prisma.comicBookmark.update({
        where,
        data,
        ...select,
      })
    },
  },
)
