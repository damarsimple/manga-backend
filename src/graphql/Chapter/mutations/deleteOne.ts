import { mutationField, nonNull } from 'nexus'

export const ChapterDeleteOneMutation = mutationField('deleteOneChapter', {
  type: 'Chapter',
  args: {
    where: nonNull('ChapterWhereUniqueInput'),
  },
  resolve: async (_parent, { where }, { prisma, select }) => {
    return prisma.chapter.delete({
      where,
      ...select,
    })
  },
})
