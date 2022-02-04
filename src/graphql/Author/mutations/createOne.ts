import { mutationField, nonNull } from 'nexus'

export const AuthorCreateOneMutation = mutationField('createOneAuthor', {
  type: nonNull('Author'),
  args: {
    data: nonNull('AuthorCreateInput'),
  },
  resolve(_parent, { data }, { prisma, select }) {
    return prisma.author.create({
      data,
      ...select,
    })
  },
})
