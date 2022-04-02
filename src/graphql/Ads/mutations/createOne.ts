import { mutationField, nonNull } from 'nexus'

export const AdsCreateOneMutation = mutationField('createOneAds', {
  type: nonNull('Ads'),
  args: {
    data: nonNull('AdsCreateInput'),
  },
  resolve(_parent, { data }, { prisma, select }) {
    return prisma.ads.create({
      data,
      ...select,
    })
  },
})
