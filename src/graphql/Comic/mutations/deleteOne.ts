import { mutationField, nonNull } from 'nexus'

export const ComicDeleteOneMutation = mutationField('deleteOneComic', {
  type: 'Comic',
  args: {
    where: nonNull('ComicWhereUniqueInput'),
  },
  resolve: async (_parent, { where }, { prisma, select }) => {
    return prisma.comic.delete({
      where,
      ...select,
    })
  },
})
