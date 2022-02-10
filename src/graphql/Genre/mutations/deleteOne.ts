import { mutationField, nonNull } from 'nexus'
import { deleteDocumentIndex } from '../../../modules/Meilisearch'

export const GenreDeleteOneMutation = mutationField('deleteOneGenre', {
  type: 'Genre',
  args: {
    where: nonNull('GenreWhereUniqueInput'),
  },
  resolve: async (_parent, { where }, { prisma, select }) => {
    const genre = await prisma.genre.delete({
      where,
      ...select,
    })

    await deleteDocumentIndex(genre.id, "genres")

    return genre
  },
})
