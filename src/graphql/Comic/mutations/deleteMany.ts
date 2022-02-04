import { mutationField, nonNull } from 'nexus'

export const ComicDeleteManyMutation = mutationField('deleteManyComic', {
  type: nonNull('BatchPayload'),
  args: {
    where: 'ComicWhereInput',
  },
  resolve: async (_parent, { where }, { prisma }) => {
    return prisma.comic.deleteMany({ where } as any)
  },
})
