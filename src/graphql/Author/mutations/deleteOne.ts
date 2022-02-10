import { mutationField, nonNull } from 'nexus'
import { deleteDocumentIndex } from '../../../modules/Meilisearch'

export const AuthorDeleteOneMutation = mutationField('deleteOneAuthor', {
  type: 'Author',
  args: {
    where: nonNull('AuthorWhereUniqueInput'),
  },
  resolve: async (_parent, { where }, { prisma, select }) => {
    const author = await prisma.author.delete({
      where,
      ...select,
    })

    await deleteDocumentIndex(author.id, "authors")

    return author
  },
})
