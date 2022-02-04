import { mutationField, nonNull } from 'nexus'

export const AdsUpsertOneMutation = mutationField('upsertOneAds', {
  type: nonNull('Ads'),
  args: {
    where: nonNull('AdsWhereUniqueInput'),
    create: nonNull('AdsCreateInput'),
    update: nonNull('AdsUpdateInput'),
  },
  resolve(_parent, args, { prisma, select }) {
    return prisma.ads.upsert({
      ...args,
      ...select,
    })
  },
})
