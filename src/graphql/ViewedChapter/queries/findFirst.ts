import { queryField, list } from 'nexus'

export const ViewedChapterFindFirstQuery = queryField(
  'findFirstViewedChapter',
  {
    type: 'ViewedChapter',
    args: {
      where: 'ViewedChapterWhereInput',
      orderBy: list('ViewedChapterOrderByWithRelationInput'),
      cursor: 'ViewedChapterWhereUniqueInput',
      take: 'Int',
      skip: 'Int',
      distinct: list('ViewedChapterScalarFieldEnum'),
    },
    resolve(_parent, args, { prisma, select }) {
      return prisma.viewedChapter.findFirst({
        ...args,
        ...select,
      })
    },
  },
)
