import { queryField, nonNull } from 'nexus'

export const MissingFindUniqueQuery = queryField('findUniqueMissing', {
  type: 'Missing',
  args: {
    where: nonNull('MissingWhereUniqueInput'),
  },
  resolve(_parent, { where }, { prisma, select }) {
    return prisma.missing.findUnique({
      where,
      ...select,
    })
  },
})
