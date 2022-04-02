import { queryField, nonNull, list } from 'nexus'

export const ViewedChapterFindManyQuery = queryField('findManyViewedChapter', {
  type: nonNull(list(nonNull('ViewedChapter'))),
  args: {
    where: 'ViewedChapterWhereInput',
    orderBy: list('ViewedChapterOrderByWithRelationInput'),
    cursor: 'ViewedChapterWhereUniqueInput',
    take: 'Int',
    skip: 'Int',
    distinct: list('ViewedChapterScalarFieldEnum'),
  },
  resolve(_parent, args, { prisma, select }) {
    return prisma.viewedChapter.findMany({
      ...args,
      ...select,
    })
  },
})
