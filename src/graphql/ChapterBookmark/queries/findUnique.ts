import { queryField, nonNull } from 'nexus'

export const ChapterBookmarkFindUniqueQuery = queryField(
  'findUniqueChapterBookmark',
  {
    type: 'ChapterBookmark',
    args: {
      where: nonNull('ChapterBookmarkWhereUniqueInput'),
    },
    resolve(_parent, { where }, { prisma, select }) {
      return prisma.chapterBookmark.findUnique({
        where,
        ...select,
      })
    },
  },
)
