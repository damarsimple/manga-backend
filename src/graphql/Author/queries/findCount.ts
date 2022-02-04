import { queryField, nonNull, list } from 'nexus'

export const AuthorFindCountQuery = queryField('findManyAuthorCount', {
  type: nonNull('Int'),
  args: {
    where: 'AuthorWhereInput',
    orderBy: list('AuthorOrderByWithRelationInput'),
    cursor: 'AuthorWhereUniqueInput',
    take: 'Int',
    skip: 'Int',
    distinct: list('AuthorScalarFieldEnum'),
  },
  resolve(_parent, args, { prisma }) {
    return prisma.author.count(args as any)
  },
})
