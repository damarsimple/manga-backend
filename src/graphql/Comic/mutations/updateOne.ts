import { mutationField, nonNull } from 'nexus'

export const ComicUpdateOneMutation = mutationField('updateOneComic', {
  type: nonNull('Comic'),
  args: {
    data: nonNull('ComicUpdateInput'),
    where: nonNull('ComicWhereUniqueInput'),
  },
  resolve(_parent, { data, where }, { prisma, select }) {
    return prisma.comic.update({
      where,
      data,
      ...select,
    })
  },
})
