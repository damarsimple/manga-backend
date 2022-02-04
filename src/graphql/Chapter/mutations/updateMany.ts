import { mutationField, nonNull } from 'nexus'

export const ChapterUpdateManyMutation = mutationField('updateManyChapter', {
  type: nonNull('BatchPayload'),
  args: {
    data: nonNull('ChapterUpdateManyMutationInput'),
    where: 'ChapterWhereInput',
  },
  resolve(_parent, args, { prisma }) {
    return prisma.chapter.updateMany(args as any)
  },
})
