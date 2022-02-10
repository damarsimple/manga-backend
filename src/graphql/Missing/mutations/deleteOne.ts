import { mutationField, nonNull } from 'nexus'

export const MissingDeleteOneMutation = mutationField('deleteOneMissing', {
  type: 'Missing',
  args: {
    where: nonNull('MissingWhereUniqueInput'),
  },
  resolve: async (_parent, { where }, { prisma, select }) => {
    return prisma.missing.delete({
      where,
      ...select,
    })
  },
})
