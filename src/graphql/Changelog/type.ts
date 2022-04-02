import { objectType } from 'nexus'

export const Changelog = objectType({
  nonNullDefaults: {
    output: true,
    input: false,
  },
  name: 'Changelog',
  definition(t) {
    t.int('id')
    t.string('version')
    t.list.string('features')
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
