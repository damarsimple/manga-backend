import { queryField, nonNull, list } from "nexus";

export const ComicFindManyQuery = queryField("findManyComic", {
  type: nonNull(list(nonNull("Comic"))),
  args: {
    where: "ComicWhereInput",
    orderBy: list("ComicOrderByWithRelationInput"),
    cursor: "ComicWhereUniqueInput",
    take: "Int",
    skip: "Int",
    distinct: list("ComicScalarFieldEnum"),
  },
  async resolve(_parent, args, { prisma, select }, { operation }) {


    return await prisma.comic.findMany({
      ...args,
      ...select,
    });




  },
});
