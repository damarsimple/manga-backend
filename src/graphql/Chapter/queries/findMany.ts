import { queryField, nonNull, list } from 'nexus'

export const ChapterFindManyQuery = queryField('findManyChapter', {
  type: nonNull(list(nonNull('Chapter'))),
  args: {
    where: 'ChapterWhereInput',
    orderBy: list('ChapterOrderByWithRelationInput'),
    cursor: 'ChapterWhereUniqueInput',
    take: 'Int',
    skip: 'Int',
    distinct: list('ChapterScalarFieldEnum'),
  },
  resolve(_parent, args, { prisma, select }) {
    return prisma.chapter.findMany({
      ...args,
      ...select,
    })
  },
})
