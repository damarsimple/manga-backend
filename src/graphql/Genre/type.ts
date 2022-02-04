import { objectType } from 'nexus'

export const Genre = objectType({
  nonNullDefaults: {
    output: true,
    input: false,
  },
  name: 'Genre',
  definition(t) {
    t.int('id')
    t.string('name')
    t.string('slug')
    t.field('createdAt', { type: 'DateTime' })
    t.field('updatedAt', { type: 'DateTime' })
    t.list.field('comics', {
      type: 'Comic',
      args: {
        where: 'ComicWhereInput',
        orderBy: 'ComicOrderByWithRelationInput',
        cursor: 'ComicWhereUniqueInput',
        take: 'Int',
        skip: 'Int',
        distinct: 'ComicScalarFieldEnum',
      },
      resolve(root: any) {
        return root.comics
      },
    })
    t.field('_count', {
      type: 'GenreCountOutputType',
      resolve(root: any) {
        return root._count
      },
    })
  },
})
