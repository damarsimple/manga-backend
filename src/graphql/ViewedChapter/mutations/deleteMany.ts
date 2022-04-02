import { mutationField, nonNull } from 'nexus'

export const ViewedChapterDeleteManyMutation = mutationField(
  'deleteManyViewedChapter',
  {
    type: nonNull('BatchPayload'),
    args: {
      where: 'ViewedChapterWhereInput',
    },
    resolve: async (_parent, { where }, { prisma }) => {
      return prisma.viewedChapter.deleteMany({ where } as any)
    },
  },
)
