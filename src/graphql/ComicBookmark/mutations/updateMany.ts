import { mutationField, nonNull } from 'nexus'

export const ComicBookmarkUpdateManyMutation = mutationField(
  'updateManyComicBookmark',
  {
    type: nonNull('BatchPayload'),
    args: {
      data: nonNull('ComicBookmarkUpdateManyMutationInput'),
      where: 'ComicBookmarkWhereInput',
    },
    resolve(_parent, args, { prisma }) {
      return prisma.comicBookmark.updateMany(args as any)
    },
  },
)
