import { queryField, nonNull, list } from 'nexus'

export const AdsFindManyQuery = queryField('findManyAds', {
  type: nonNull(list(nonNull('Ads'))),
  args: {
    where: 'AdsWhereInput',
    orderBy: list('AdsOrderByWithRelationInput'),
    cursor: 'AdsWhereUniqueInput',
    take: 'Int',
    skip: 'Int',
    distinct: list('AdsScalarFieldEnum'),
  },
  resolve(_parent, args, { prisma, select }) {
    return prisma.ads.findMany({
      ...args,
      ...select,
    })
  },
})
