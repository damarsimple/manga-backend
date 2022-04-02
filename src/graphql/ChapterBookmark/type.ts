import { objectType } from 'nexus'

export const ChapterBookmark = objectType({
  nonNullDefaults: {
    output: true,
    input: false,
  },
  name: 'ChapterBookmark',
  definition(t) {
    t.int('id')
    t.int('chapterId')
    t.field('chapter', {
      type: 'Chapter',
      resolve(root: any) {
        return root.chapter
      },
    })
    t.int('userId')
    t.field('user', {
      type: 'User',
      resolve(root: any) {
        return root.user
      },
    })
    t.field('createdAt', { type: 'DateTime' })
    t.field('updatedAt', { type: 'DateTime' })
  },
})
