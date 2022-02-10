import { mutationField, nonNull } from 'nexus'

export const MissingUpdateOneMutation = mutationField('updateOneMissing', {
  type: nonNull('Missing'),
  args: {
    data: nonNull('MissingUpdateInput'),
    where: nonNull('MissingWhereUniqueInput'),
  },
  resolve(_parent, { data, where }, { prisma, select }) {
    return prisma.missing.update({
      where,
      data,
      ...select,
    })
  },
})
