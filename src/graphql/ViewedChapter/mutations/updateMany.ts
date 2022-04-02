import { mutationField, nonNull } from 'nexus'

export const ViewedChapterUpdateManyMutation = mutationField(
  'updateManyViewedChapter',
  {
    type: nonNull('BatchPayload'),
    args: {
      data: nonNull('ViewedChapterUpdateManyMutationInput'),
      where: 'ViewedChapterWhereInput',
    },
    resolve(_parent, args, { prisma }) {
      return prisma.viewedChapter.updateMany(args as any)
    },
  },
)
