import { queryField, list } from 'nexus'

export const AuthorFindFirstQuery = queryField('findFirstAuthor', {
  type: 'Author',
  args: {
    where: 'AuthorWhereInput',
    orderBy: list('AuthorOrderByWithRelationInput'),
    cursor: 'AuthorWhereUniqueInput',
    take: 'Int',
    skip: 'Int',
    distinct: list('AuthorScalarFieldEnum'),
  },
  resolve(_parent, args, { prisma, select }) {
    return prisma.author.findFirst({
      ...args,
      ...select,
    })
  },
})
