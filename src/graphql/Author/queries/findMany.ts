import { queryField, nonNull, list } from 'nexus'

export const AuthorFindManyQuery = queryField('findManyAuthor', {
  type: nonNull(list(nonNull('Author'))),
  args: {
    where: 'AuthorWhereInput',
    orderBy: list('AuthorOrderByWithRelationInput'),
    cursor: 'AuthorWhereUniqueInput',
    take: 'Int',
    skip: 'Int',
    distinct: list('AuthorScalarFieldEnum'),
  },
  resolve(_parent, args, { prisma, select }) {
    return prisma.author.findMany({
      ...args,
      ...select,
    })
  },
})
