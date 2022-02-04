import { queryField, nonNull, list } from 'nexus'

export const ChapterFindCountQuery = queryField('findManyChapterCount', {
  type: nonNull('Int'),
  args: {
    where: 'ChapterWhereInput',
    orderBy: list('ChapterOrderByWithRelationInput'),
    cursor: 'ChapterWhereUniqueInput',
    take: 'Int',
    skip: 'Int',
    distinct: list('ChapterScalarFieldEnum'),
  },
  resolve(_parent, args, { prisma }) {
    return prisma.chapter.count(args as any)
  },
})
