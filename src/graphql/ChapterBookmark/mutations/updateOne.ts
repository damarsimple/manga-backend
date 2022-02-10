import { mutationField, nonNull } from 'nexus'

export const ChapterBookmarkUpdateOneMutation = mutationField(
  'updateOneChapterBookmark',
  {
    type: nonNull('ChapterBookmark'),
    args: {
      data: nonNull('ChapterBookmarkUpdateInput'),
      where: nonNull('ChapterBookmarkWhereUniqueInput'),
    },
    resolve(_parent, { data, where }, { prisma, select }) {
      return prisma.chapterBookmark.update({
        where,
        data,
        ...select,
      })
    },
  },
)
