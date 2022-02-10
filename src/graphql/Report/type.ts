import { objectType } from 'nexus'

export const Report = objectType({
  nonNullDefaults: {
    output: true,
    input: false,
  },
  name: 'Report',
  definition(t) {
    t.int('id')
    t.nullable.int('userId')
    t.nullable.field('user', {
      type: 'User',
      resolve(root: any) {
        return root.user
      },
    })
    t.string('name')
    t.nullable.string('message')
    t.string('contextIdentifier')
    t.string('contextType')
    t.boolean('resolved')
    t.field('createdAt', { type: 'DateTime' })
    t.field('updatedAt', { type: 'DateTime' })
  },
})
