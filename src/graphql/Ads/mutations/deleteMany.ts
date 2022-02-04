import { mutationField, nonNull } from 'nexus'

export const AdsDeleteManyMutation = mutationField('deleteManyAds', {
  type: nonNull('BatchPayload'),
  args: {
    where: 'AdsWhereInput',
  },
  resolve: async (_parent, { where }, { prisma }) => {
    return prisma.ads.deleteMany({ where } as any)
  },
})
