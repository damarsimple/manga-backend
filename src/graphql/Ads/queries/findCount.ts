import { queryField, nonNull, list } from 'nexus'

export const AdsFindCountQuery = queryField('findManyAdsCount', {
  type: nonNull('Int'),
  args: {
    where: 'AdsWhereInput',
    orderBy: list('AdsOrderByWithRelationInput'),
    cursor: 'AdsWhereUniqueInput',
    take: 'Int',
    skip: 'Int',
    distinct: list('AdsScalarFieldEnum'),
  },
  resolve(_parent, args, { prisma }) {
    return prisma.ads.count(args as any)
  },
})
