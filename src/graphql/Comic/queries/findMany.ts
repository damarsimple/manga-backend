import { queryField, nonNull, list } from "nexus";
import { connection } from "../../../modules/Redis";

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
    const isHentai = args.where?.isHentai?.equals ?? true;

    const key = `${operation.name?.value}-${
      isHentai ? "with-hentai" : "without-hentai"
    }-${args.take}-${args.skip}-${Object.keys(select.select).join(",")}`;

    if (!operation.name?.value) {
      return await prisma.comic.findMany({
        ...args,
        ...select,
      });
    }

    connection.sadd("COMIC_FINDMANY", key);

    const data = (await connection.get(key)) as any;

    if (!data) {
      const data = await prisma.comic.findMany({
        ...args,
        ...select,
      });
      connection.set(key, JSON.stringify(data), "EX", 60 * 5);

      return data;
    }

    return JSON.parse(data);
  },
});
