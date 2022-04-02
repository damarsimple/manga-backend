import { mutationField, nonNull } from 'nexus'

export const AuthorDeleteOneMutation = mutationField('deleteOneAuthor', {
  type: 'Author',
  args: {
    where: nonNull('AuthorWhereUniqueInput'),
  },
  resolve: async (_parent, { where }, { prisma, select }) => {
    return prisma.author.delete({
      where,
      ...select,
    })
  },
})
