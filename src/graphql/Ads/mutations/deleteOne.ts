import { mutationField, nonNull } from 'nexus'

export const AdsDeleteOneMutation = mutationField('deleteOneAds', {
  type: 'Ads',
  args: {
    where: nonNull('AdsWhereUniqueInput'),
  },
  resolve: async (_parent, { where }, { prisma, select }) => {
    return prisma.ads.delete({
      where,
      ...select,
    })
  },
})
