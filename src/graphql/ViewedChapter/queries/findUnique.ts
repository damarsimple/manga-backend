import { queryField, nonNull } from 'nexus'

export const ViewedChapterFindUniqueQuery = queryField(
  'findUniqueViewedChapter',
  {
    type: 'ViewedChapter',
    args: {
      where: nonNull('ViewedChapterWhereUniqueInput'),
    },
    resolve(_parent, { where }, { prisma, select }) {
      return prisma.viewedChapter.findUnique({
        where,
        ...select,
      })
    },
  },
)
