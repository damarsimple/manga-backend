import { objectType } from 'nexus'

export const PerfomanceAnalytic = objectType({
  nonNullDefaults: {
    output: true,
    input: false,
  },
  name: 'PerfomanceAnalytic',
  definition(t) {
    t.int('id')
    t.string('operationName')
    t.string('query')
    t.string('variables')
    t.float('time')
    t.field('createdAt', { type: 'DateTime' })
    t.field('updatedAt', { type: 'DateTime' })
  },
})
