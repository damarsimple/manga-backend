import { mutationField, nonNull } from 'nexus'

export const ChapterBookmarkCreateOneMutation = mutationField(
  'createOneChapterBookmark',
  {
    type: nonNull('ChapterBookmark'),
    args: {
      data: nonNull('ChapterBookmarkCreateInput'),
    },
    resolve(_parent, { data }, { prisma, select }) {
      return prisma.chapterBookmark.create({
        data,
        ...select,
      })
    },
  },
)
