import { mutationField, nonNull } from 'nexus'

export const GenreUpsertOneMutation = mutationField('upsertOneGenre', {
  type: nonNull('Genre'),
  args: {
    where: nonNull('GenreWhereUniqueInput'),
    create: nonNull('GenreCreateInput'),
    update: nonNull('GenreUpdateInput'),
  },
  resolve(_parent, args, { prisma, select }) {
    return prisma.genre.upsert({
      ...args,
      ...select,
    })
  },
})
