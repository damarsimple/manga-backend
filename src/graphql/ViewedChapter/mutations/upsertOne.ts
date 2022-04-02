import { mutationField, nonNull } from 'nexus'

export const ViewedChapterUpsertOneMutation = mutationField(
  'upsertOneViewedChapter',
  {
    type: nonNull('ViewedChapter'),
    args: {
      where: nonNull('ViewedChapterWhereUniqueInput'),
      create: nonNull('ViewedChapterCreateInput'),
      update: nonNull('ViewedChapterUpdateInput'),
    },
    resolve(_parent, args, { prisma, select }) {
      return prisma.viewedChapter.upsert({
        ...args,
        ...select,
      })
    },
  },
)
