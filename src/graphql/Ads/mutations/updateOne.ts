import { mutationField, nonNull } from 'nexus'

export const AdsUpdateOneMutation = mutationField('updateOneAds', {
  type: nonNull('Ads'),
  args: {
    data: nonNull('AdsUpdateInput'),
    where: nonNull('AdsWhereUniqueInput'),
  },
  resolve(_parent, { data, where }, { prisma, select }) {
    return prisma.ads.update({
      where,
      data,
      ...select,
    })
  },
})
