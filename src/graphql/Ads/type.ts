import { objectType } from 'nexus'

export const Ads = objectType({
  nonNullDefaults: {
    output: true,
    input: false,
  },
  name: 'Ads',
  definition(t) {
    t.int('id')
    t.string('name')
    t.list.field('position', { type: 'AdsPosition' })
    t.string('url')
    t.nullable.string('image')
    t.int('index')
    t.field('createdAt', { type: 'DateTime' })
    t.field('updatedAt', { type: 'DateTime' })
  },
})
