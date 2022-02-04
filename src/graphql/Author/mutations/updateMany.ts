import { mutationField, nonNull } from 'nexus'

export const AuthorUpdateManyMutation = mutationField('updateManyAuthor', {
  type: nonNull('BatchPayload'),
  args: {
    data: nonNull('AuthorUpdateManyMutationInput'),
    where: 'AuthorWhereInput',
  },
  resolve(_parent, args, { prisma }) {
    return prisma.author.updateMany(args as any)
  },
})
