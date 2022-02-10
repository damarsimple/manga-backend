import { mutationField, nonNull } from 'nexus'
import { deleteDocumentIndex } from '../../../modules/Meilisearch';

export const ComicDeleteOneMutation = mutationField('deleteOneComic', {
  type: 'Comic',
  args: {
    where: nonNull('ComicWhereUniqueInput'),
  },
  resolve: async (_parent, { where }, { prisma, select }) => {
    const comic = await prisma.comic.delete({
      where,
      ...select,
    });

    await deleteDocumentIndex(comic.id, "comics");

    return comic
  },
})
