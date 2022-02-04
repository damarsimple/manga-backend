import { mutationField, nonNull } from 'nexus'

export const AuthorUpsertOneMutation = mutationField('upsertOneAuthor', {
  type: nonNull('Author'),
  args: {
    where: nonNull('AuthorWhereUniqueInput'),
    create: nonNull('AuthorCreateInput'),
    update: nonNull('AuthorUpdateInput'),
  },
  resolve(_parent, args, { prisma, select }) {
    return prisma.author.upsert({
      ...args,
      ...select,
    })
  },
})
