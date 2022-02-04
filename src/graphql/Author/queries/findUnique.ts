import { queryField, nonNull } from 'nexus'

export const AuthorFindUniqueQuery = queryField('findUniqueAuthor', {
  type: 'Author',
  args: {
    where: nonNull('AuthorWhereUniqueInput'),
  },
  resolve(_parent, { where }, { prisma, select }) {
    return prisma.author.findUnique({
      where,
      ...select,
    })
  },
})
