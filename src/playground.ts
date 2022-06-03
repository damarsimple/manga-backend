import { prisma } from "./modules/Context";
import axios from "axios";
import BunnyCDN from "./modules/BunnyCDN";

async function main() {
  const comics = await prisma.comic.findMany();

  const notFounds = [];

  const comicsD = comics.map((e) => ({
    ...e,
    thumb: e.thumb?.replace("cdn.gudangkomik.com", "backupcdn.gudangkomik.com"),
    thumbWide: e.thumbWide?.replace(
      "cdn.gudangkomik.com",
      "backupcdn.gudangkomik.com"
    ),
  }));

  const slugs = [];

  const bunny = new BunnyCDN({ log: false });
  let idx = 1;
  for (const { id, slug, thumbWide, thumb } of comicsD) {
    if (thumbWide) {
      try {
        const res = await axios.head(thumbWide);

        if (res.status == 200) {
          const succes = await bunny.downloadAndUpload(
            thumbWide,
            thumbWide?.replace("https://backupcdn.gudangkomik.com", "")
          );

          const newThumb = thumbWide?.replace(
            "https://backupcdn.gudangkomik.com",
            "https://cdn1.gudangkomik.com"
          );

          await prisma.comic.update({
            where: { id: id },
            data: { thumbWide: newThumb },
          });
        } else {
          notFounds.push(thumbWide);
        }
      } catch (error: any) {
        notFounds.push(thumbWide);
      }
    }

    try {
      const res = await axios.head(thumb);

      if (res.status == 200) {
        const succes = await bunny.downloadAndUpload(
          thumb,
          thumb?.replace("https://backupcdn.gudangkomik.com", "")
        );

        const newThumb = thumb?.replace(
          "https://backupcdn.gudangkomik.com",
          "https://cdn1.gudangkomik.com"
        );

        await prisma.comic.update({
          where: { id: id },
          data: { thumb: newThumb },
        });
      } else {
        notFounds.push(thumb);
      }
    } catch (error: any) {
      notFounds.push(thumb);
      slugs.push(slug);
    }
    idx++;
    console.log(
      `[${idx}/${comicsD.length}] ${slug} Finish ${
        slugs.includes(slug) ? "NOT FOUND" : "FOUND"
      }`
    );
  }
  console.log(notFounds);
  console.log(slugs);
}

main();
