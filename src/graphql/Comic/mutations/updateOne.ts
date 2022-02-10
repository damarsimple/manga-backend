import { mutationField, nonNull } from 'nexus'
import { updateDocumentIndex } from '../../../modules/Meilisearch';

export const ComicUpdateOneMutation = mutationField('updateOneComic', {
  type: nonNull('Comic'),
  args: {
    data: nonNull('ComicUpdateInput'),
    where: nonNull('ComicWhereUniqueInput'),
  },
  resolve: async (_parent, { data, where }, { prisma, select }) => {

    const comic = await prisma.comic.update({
      where,
      data,
      ...select,
    })

    await updateDocumentIndex(comic.id, "comics", comic);

    return comic

  }

})
