import { mutationField, nonNull } from 'nexus'
import { updateDocumentIndex } from '../../../modules/Meilisearch';

export const GenreCreateOneMutation = mutationField('createOneGenre', {
  type: nonNull('Genre'),
  args: {
    data: nonNull('GenreCreateInput'),
  },
  resolve: async (_parent, { data }, { prisma, select }) => {
    const genre = await prisma.genre.create({
      data,
      ...select,
    })

    await updateDocumentIndex(genre.id, "genres", genre);

    return genre;

  },

})
