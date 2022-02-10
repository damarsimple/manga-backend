import { objectType } from 'nexus'

export const Missing = objectType({
  nonNullDefaults: {
    output: true,
    input: false,
  },
  name: 'Missing',
  definition(t) {
    t.int('id')
    t.string('data')
    t.string('context')
    t.boolean('resolved')
    t.field('createdAt', { type: 'DateTime' })
    t.field('updatedAt', { type: 'DateTime' })
  },
})
