import { mutationField, nonNull } from 'nexus'

export const ChapterBookmarkDeleteManyMutation = mutationField(
  'deleteManyChapterBookmark',
  {
    type: nonNull('BatchPayload'),
    args: {
      where: 'ChapterBookmarkWhereInput',
    },
    resolve: async (_parent, { where }, { prisma }) => {
      return prisma.chapterBookmark.deleteMany({ where } as any)
    },
  },
)
