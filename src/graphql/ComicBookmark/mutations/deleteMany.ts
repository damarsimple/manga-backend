import { mutationField, nonNull } from 'nexus'

export const ComicBookmarkDeleteManyMutation = mutationField(
  'deleteManyComicBookmark',
  {
    type: nonNull('BatchPayload'),
    args: {
      where: 'ComicBookmarkWhereInput',
    },
    resolve: async (_parent, { where }, { prisma }) => {
      return prisma.comicBookmark.deleteMany({ where } as any)
    },
  },
)
