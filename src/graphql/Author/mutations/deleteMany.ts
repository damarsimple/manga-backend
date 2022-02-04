import { mutationField, nonNull } from 'nexus'

export const AuthorDeleteManyMutation = mutationField('deleteManyAuthor', {
  type: nonNull('BatchPayload'),
  args: {
    where: 'AuthorWhereInput',
  },
  resolve: async (_parent, { where }, { prisma }) => {
    return prisma.author.deleteMany({ where } as any)
  },
})
