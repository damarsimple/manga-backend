import { queryField, nonNull, list } from 'nexus'

export const ChapterBookmarkFindCountQuery = queryField(
  'findManyChapterBookmarkCount',
  {
    type: nonNull('Int'),
    args: {
      where: 'ChapterBookmarkWhereInput',
      orderBy: list('ChapterBookmarkOrderByWithRelationInput'),
      cursor: 'ChapterBookmarkWhereUniqueInput',
      take: 'Int',
      skip: 'Int',
      distinct: list('ChapterBookmarkScalarFieldEnum'),
    },
    resolve(_parent, args, { prisma }) {
      return prisma.chapterBookmark.count(args as any)
    },
  },
)
