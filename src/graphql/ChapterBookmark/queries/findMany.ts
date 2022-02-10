import { queryField, nonNull, list } from 'nexus'

export const ChapterBookmarkFindManyQuery = queryField(
  'findManyChapterBookmark',
  {
    type: nonNull(list(nonNull('ChapterBookmark'))),
    args: {
      where: 'ChapterBookmarkWhereInput',
      orderBy: list('ChapterBookmarkOrderByWithRelationInput'),
      cursor: 'ChapterBookmarkWhereUniqueInput',
      take: 'Int',
      skip: 'Int',
      distinct: list('ChapterBookmarkScalarFieldEnum'),
    },
    resolve(_parent, args, { prisma, select }) {
      return prisma.chapterBookmark.findMany({
        ...args,
        ...select,
      })
    },
  },
)
