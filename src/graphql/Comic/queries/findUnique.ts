import { queryField, nonNull } from 'nexus'

export const ComicFindUniqueQuery = queryField('findUniqueComic', {
  type: 'Comic',
  args: {
    where: nonNull('ComicWhereUniqueInput'),
  },
  resolve(_parent, { where }, { prisma, select }) {
    return prisma.comic.findUnique({
      where,
      ...select,
    })
  },
})
