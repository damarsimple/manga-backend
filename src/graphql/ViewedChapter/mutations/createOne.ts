import { mutationField, nonNull } from 'nexus'

export const ViewedChapterCreateOneMutation = mutationField(
  'createOneViewedChapter',
  {
    type: nonNull('ViewedChapter'),
    args: {
      data: nonNull('ViewedChapterCreateInput'),
    },
    resolve(_parent, { data }, { prisma, select }) {
      return prisma.viewedChapter.create({
        data,
        ...select,
      })
    },
  },
)
