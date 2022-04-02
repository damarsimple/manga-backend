import { queryField, nonNull, list } from 'nexus'

export const ViewedChapterFindCountQuery = queryField(
  'findManyViewedChapterCount',
  {
    type: nonNull('Int'),
    args: {
      where: 'ViewedChapterWhereInput',
      orderBy: list('ViewedChapterOrderByWithRelationInput'),
      cursor: 'ViewedChapterWhereUniqueInput',
      take: 'Int',
      skip: 'Int',
      distinct: list('ViewedChapterScalarFieldEnum'),
    },
    resolve(_parent, args, { prisma }) {
      return prisma.viewedChapter.count(args as any)
    },
  },
)
