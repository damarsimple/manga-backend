import { queryField, list } from 'nexus'

export const ChapterBookmarkFindFirstQuery = queryField(
  'findFirstChapterBookmark',
  {
    type: 'ChapterBookmark',
    args: {
      where: 'ChapterBookmarkWhereInput',
      orderBy: list('ChapterBookmarkOrderByWithRelationInput'),
      cursor: 'ChapterBookmarkWhereUniqueInput',
      take: 'Int',
      skip: 'Int',
      distinct: list('ChapterBookmarkScalarFieldEnum'),
    },
    resolve(_parent, args, { prisma, select }) {
      return prisma.chapterBookmark.findFirst({
        ...args,
        ...select,
      })
    },
  },
)
