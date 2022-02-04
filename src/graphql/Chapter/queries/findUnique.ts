import { queryField, nonNull } from 'nexus'

export const ChapterFindUniqueQuery = queryField('findUniqueChapter', {
  type: 'Chapter',
  args: {
    where: nonNull('ChapterWhereUniqueInput'),
  },
  resolve(_parent, { where }, { prisma, select }) {
    return prisma.chapter.findUnique({
      where,
      ...select,
    })
  },
})
