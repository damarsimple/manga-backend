import { mutationField, nonNull } from 'nexus'

export const ComicCreateOneMutation = mutationField('createOneComic', {
  type: nonNull('Comic'),
  args: {
    data: nonNull('ComicCreateInput'),
  },
  resolve(_parent, { data }, { prisma, select }) {
    return prisma.comic.create({
      data,
      ...select,
    })
  },
})
