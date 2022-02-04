import { mutationField, nonNull } from 'nexus'

export const ChapterCreateOneMutation = mutationField('createOneChapter', {
  type: nonNull('Chapter'),
  args: {
    data: nonNull('ChapterCreateInput'),
  },
  resolve(_parent, { data }, { prisma, select }) {
    return prisma.chapter.create({
      data,
      ...select,
    })
  },
})
