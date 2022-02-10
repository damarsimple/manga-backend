import { mutationField, nonNull } from 'nexus'

export const ComicBookmarkCreateOneMutation = mutationField(
  'createOneComicBookmark',
  {
    type: nonNull('ComicBookmark'),
    args: {
      data: nonNull('ComicBookmarkCreateInput'),
    },
    resolve(_parent, { data }, { prisma, select }) {
      return prisma.comicBookmark.create({
        data,
        ...select,
      })
    },
  },
)
