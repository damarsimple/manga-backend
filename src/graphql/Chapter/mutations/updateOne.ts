import { mutationField, nonNull } from 'nexus'

export const ChapterUpdateOneMutation = mutationField('updateOneChapter', {
  type: nonNull('Chapter'),
  args: {
    data: nonNull('ChapterUpdateInput'),
    where: nonNull('ChapterWhereUniqueInput'),
  },
  resolve(_parent, { data, where }, { prisma, select }) {
    return prisma.chapter.update({
      where,
      data,
      ...select,
    })
  },
})
