import { mutationField, nonNull } from 'nexus'

export const AdsUpdateManyMutation = mutationField('updateManyAds', {
  type: nonNull('BatchPayload'),
  args: {
    data: nonNull('AdsUpdateManyMutationInput'),
    where: 'AdsWhereInput',
  },
  resolve(_parent, args, { prisma }) {
    return prisma.ads.updateMany(args as any)
  },
})
