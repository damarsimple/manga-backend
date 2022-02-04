import { queryField, nonNull } from 'nexus'

export const AdsFindUniqueQuery = queryField('findUniqueAds', {
  type: 'Ads',
  args: {
    where: nonNull('AdsWhereUniqueInput'),
  },
  resolve(_parent, { where }, { prisma, select }) {
    return prisma.ads.findUnique({
      where,
      ...select,
    })
  },
})
