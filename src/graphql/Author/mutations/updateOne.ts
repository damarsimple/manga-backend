import { mutationField, nonNull } from 'nexus'

export const AuthorUpdateOneMutation = mutationField('updateOneAuthor', {
  type: nonNull('Author'),
  args: {
    data: nonNull('AuthorUpdateInput'),
    where: nonNull('AuthorWhereUniqueInput'),
  },
  resolve(_parent, { data, where }, { prisma, select }) {
    return prisma.author.update({
      where,
      data,
      ...select,
    })
  },
})
