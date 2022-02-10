import { mutationField, nonNull } from 'nexus'
import { updateDocumentIndex } from '../../../modules/Meilisearch';

export const GenreUpdateOneMutation = mutationField('updateOneGenre', {
  type: nonNull('Genre'),
  args: {
    data: nonNull('GenreUpdateInput'),
    where: nonNull('GenreWhereUniqueInput'),
  },
  resolve: async (_parent, { data, where }, { prisma, select }) => {
    const genre = await prisma.genre.update({
      where,
      data,
      ...select,
    })

    await updateDocumentIndex(genre.id, "genres", genre);

    return genre;
  },
})
