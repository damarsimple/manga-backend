import { mutationField, nonNull } from 'nexus'

export const ViewedChapterDeleteOneMutation = mutationField(
  'deleteOneViewedChapter',
  {
    type: 'ViewedChapter',
    args: {
      where: nonNull('ViewedChapterWhereUniqueInput'),
    },
    resolve: async (_parent, { where }, { prisma, select }) => {
      return prisma.viewedChapter.delete({
        where,
        ...select,
      })
    },
  },
)
