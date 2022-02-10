import { mutationField, nonNull } from 'nexus'

export const ChapterBookmarkUpsertOneMutation = mutationField(
  'upsertOneChapterBookmark',
  {
    type: nonNull('ChapterBookmark'),
    args: {
      where: nonNull('ChapterBookmarkWhereUniqueInput'),
      create: nonNull('ChapterBookmarkCreateInput'),
      update: nonNull('ChapterBookmarkUpdateInput'),
    },
    resolve(_parent, args, { prisma, select }) {
      return prisma.chapterBookmark.upsert({
        ...args,
        ...select,
      })
    },
  },
)
