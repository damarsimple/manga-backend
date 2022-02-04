import { queryField, list } from 'nexus'

export const AdsAggregateQuery = queryField('aggregateAds', {
  type: 'AggregateAds',
  args: {
    where: 'AdsWhereInput',
    orderBy: list('AdsOrderByWithRelationInput'),
    cursor: 'AdsWhereUniqueInput',
    take: 'Int',
    skip: 'Int',
  },
  resolve(_parent, args, { prisma, select }) {
    return prisma.ads.aggregate({ ...args, ...select }) as any
  },
})
