import { mutationField, nonNull } from 'nexus'

export const ViewedChapterUpdateOneMutation = mutationField(
  'updateOneViewedChapter',
  {
    type: nonNull('ViewedChapter'),
    args: {
      data: nonNull('ViewedChapterUpdateInput'),
      where: nonNull('ViewedChapterWhereUniqueInput'),
    },
    resolve(_parent, { data, where }, { prisma, select }) {
      return prisma.viewedChapter.update({
        where,
        data,
        ...select,
      })
    },
  },
)
