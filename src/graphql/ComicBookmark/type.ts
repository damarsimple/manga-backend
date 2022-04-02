import { objectType } from 'nexus'

export const ComicBookmark = objectType({
  nonNullDefaults: {
    output: true,
    input: false,
  },
  name: 'ComicBookmark',
  definition(t) {
    t.int('id')
    t.int('comicId')
    t.field('comic', {
      type: 'Comic',
      resolve(root: any) {
        return root.comic
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
