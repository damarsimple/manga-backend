import { mutationField, nonNull } from 'nexus'

export const ComicUpsertOneMutation = mutationField('upsertOneComic', {
  type: nonNull('Comic'),
  args: {
    where: nonNull('ComicWhereUniqueInput'),
    create: nonNull('ComicCreateInput'),
    update: nonNull('ComicUpdateInput'),
  },
  resolve(_parent, args, { prisma, select }) {
    return prisma.comic.upsert({
      ...args,
      ...select,
    })
  },
})
