import { mutationField, nonNull } from 'nexus'

export const ComicBookmarkUpsertOneMutation = mutationField(
  'upsertOneComicBookmark',
  {
    type: nonNull('ComicBookmark'),
    args: {
      where: nonNull('ComicBookmarkWhereUniqueInput'),
      create: nonNull('ComicBookmarkCreateInput'),
      update: nonNull('ComicBookmarkUpdateInput'),
    },
    resolve(_parent, args, { prisma, select }) {
      return prisma.comicBookmark.upsert({
        ...args,
        ...select,
      })
    },
  },
)
