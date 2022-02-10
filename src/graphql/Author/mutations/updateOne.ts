import { mutationField, nonNull } from 'nexus'
import { updateDocumentIndex } from '../../../modules/Meilisearch';

export const AuthorUpdateOneMutation = mutationField('updateOneAuthor', {
  type: nonNull('Author'),
  args: {
    data: nonNull('AuthorUpdateInput'),
    where: nonNull('AuthorWhereUniqueInput'),
  },
  resolve: async (_parent, { data, where }, { prisma, select }) => {

    const author = await prisma.author.update({
      where,
      data,
      ...select,
    })

    await updateDocumentIndex(author.id, "authors", author);

    return author
  },
})
