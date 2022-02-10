import { mutationField, nonNull } from 'nexus'

export const ChapterBookmarkUpdateManyMutation = mutationField(
  'updateManyChapterBookmark',
  {
    type: nonNull('BatchPayload'),
    args: {
      data: nonNull('ChapterBookmarkUpdateManyMutationInput'),
      where: 'ChapterBookmarkWhereInput',
    },
    resolve(_parent, args, { prisma }) {
      return prisma.chapterBookmark.updateMany(args as any)
    },
  },
)
