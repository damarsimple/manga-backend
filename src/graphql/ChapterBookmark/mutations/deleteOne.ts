import { mutationField, nonNull } from 'nexus'

export const ChapterBookmarkDeleteOneMutation = mutationField(
  'deleteOneChapterBookmark',
  {
    type: 'ChapterBookmark',
    args: {
      where: nonNull('ChapterBookmarkWhereUniqueInput'),
    },
    resolve: async (_parent, { where }, { prisma, select }) => {
      return prisma.chapterBookmark.delete({
        where,
        ...select,
      })
    },
  },
)
