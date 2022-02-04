import { mutationField, nonNull } from 'nexus'

export const ComicUpdateManyMutation = mutationField('updateManyComic', {
  type: nonNull('BatchPayload'),
  args: {
    data: nonNull('ComicUpdateManyMutationInput'),
    where: 'ComicWhereInput',
  },
  resolve(_parent, args, { prisma }) {
    return prisma.comic.updateMany(args as any)
  },
})
