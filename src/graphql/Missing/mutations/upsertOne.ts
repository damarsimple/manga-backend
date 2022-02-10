import { mutationField, nonNull } from 'nexus'

export const MissingUpsertOneMutation = mutationField('upsertOneMissing', {
  type: nonNull('Missing'),
  args: {
    where: nonNull('MissingWhereUniqueInput'),
    create: nonNull('MissingCreateInput'),
    update: nonNull('MissingUpdateInput'),
  },
  resolve(_parent, args, { prisma, select }) {
    return prisma.missing.upsert({
      ...args,
      ...select,
    })
  },
})
