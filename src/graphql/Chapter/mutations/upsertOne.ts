import { mutationField, nonNull } from 'nexus'

export const ChapterUpsertOneMutation = mutationField('upsertOneChapter', {
  type: nonNull('Chapter'),
  args: {
    where: nonNull('ChapterWhereUniqueInput'),
    create: nonNull('ChapterCreateInput'),
    update: nonNull('ChapterUpdateInput'),
  },
  resolve(_parent, args, { prisma, select }) {
    return prisma.chapter.upsert({
      ...args,
      ...select,
    })
  },
})
