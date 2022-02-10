import { mutationField, nonNull } from 'nexus'
import { updateDocumentIndex } from '../../../modules/Meilisearch';

export const AuthorCreateOneMutation = mutationField('createOneAuthor', {
  type: nonNull('Author'),
  args: {
    data: nonNull('AuthorCreateInput'),
  },
  resolve: async (_parent, { data }, { prisma, select }) => {
    const author = await prisma.author.create({
      data,
      ...select,
    })

    await updateDocumentIndex(author.id, "authors", author);

    return author
  },
})
