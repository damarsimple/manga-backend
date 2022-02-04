import { queryField, list } from 'nexus'

export const ChapterFindFirstQuery = queryField('findFirstChapter', {
  type: 'Chapter',
  args: {
    where: 'ChapterWhereInput',
    orderBy: list('ChapterOrderByWithRelationInput'),
    cursor: 'ChapterWhereUniqueInput',
    take: 'Int',
    skip: 'Int',
    distinct: list('ChapterScalarFieldEnum'),
  },
  resolve(_parent, args, { prisma, select }) {
    return prisma.chapter.findFirst({
      ...args,
      ...select,
    })
  },
})
