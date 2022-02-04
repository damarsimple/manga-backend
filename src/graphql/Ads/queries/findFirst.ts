import { queryField, list } from 'nexus'

export const AdsFindFirstQuery = queryField('findFirstAds', {
  type: 'Ads',
  args: {
    where: 'AdsWhereInput',
    orderBy: list('AdsOrderByWithRelationInput'),
    cursor: 'AdsWhereUniqueInput',
    take: 'Int',
    skip: 'Int',
    distinct: list('AdsScalarFieldEnum'),
  },
  resolve(_parent, args, { prisma, select }) {
    return prisma.ads.findFirst({
      ...args,
      ...select,
    })
  },
})
