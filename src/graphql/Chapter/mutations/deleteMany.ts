import { mutationField, nonNull } from 'nexus'

export const ChapterDeleteManyMutation = mutationField('deleteManyChapter', {
  type: nonNull('BatchPayload'),
  args: {
    where: 'ChapterWhereInput',
  },
  resolve: async (_parent, { where }, { prisma }) => {
    return prisma.chapter.deleteMany({ where } as any)
  },
})
