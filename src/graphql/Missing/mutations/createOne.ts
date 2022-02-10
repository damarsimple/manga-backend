import { mutationField, nonNull } from 'nexus'

export const MissingCreateOneMutation = mutationField('createOneMissing', {
  type: nonNull('Missing'),
  args: {
    data: nonNull('MissingCreateInput'),
  },
  resolve(_parent, { data }, { prisma, select }) {
    return prisma.missing.create({
      data,
      ...select,
    })
  },
})
