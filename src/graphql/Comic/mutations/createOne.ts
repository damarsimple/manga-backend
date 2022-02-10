import { mutationField, nonNull } from 'nexus'
import { updateDocumentIndex } from '../../../modules/Meilisearch';

export const ComicCreateOneMutation = mutationField('createOneComic', {
  type: nonNull('Comic'),
  args: {
    data: nonNull('ComicCreateInput'),
  },
  resolve: async (_parent, { data }, { prisma, select }) => {

    const comic = await prisma.comic.create({
      data,
      ...select,
    })

    await updateDocumentIndex(comic.id, "comics", comic);

    return comic
  },
})
