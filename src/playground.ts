import { prisma } from "./modules/Context";
import axios from "axios";
import BunnyCDN from "./modules/BunnyCDN";
import { writeFile } from "node:fs";
import { Agent } from "node:https";
import Manhwaindo from "./scrappers/manhwaindo";
import { JSDOM } from "jsdom";
import { slugify } from "./modules/Helper";
import Manhwaland from "./scrappers/manhwaland";
import Komikcast from "./scrappers/komikcast";
import { URL, parse } from "url";
import { chunk } from "lodash";

const stringIsAValidUrl = (s: string, protocols: string[]) => {
  try {
    new URL(s);
    const parsed = parse(s);
    return protocols
      ? parsed.protocol
        ? protocols.map((x) => `${x.toLowerCase()}:`).includes(parsed.protocol)
        : false
      : true;
  } catch (err) {
    return false;
  }
};

import data from "../orig.json";

async function main() {

  
  for (const d of data) {
    try {
      await prisma.comic.update({
        where: {
          slug: d.slug
        },
        data: {
          ...d,
        }
      })
      console.log(`${d.slug} updated`)
    } catch (error) {
      continue;
    }
  }

  // const thumbMap = new Map<string, string>();

  // const scrappers = [
  //   // new Manhwaindo({
  //     // withAll: true,
  //   // }),
  //   // new Manhwaland({ withAll: true }),
  //   new Komikcast({ withAll: true }),
  // ];
  // const bunny = new BunnyCDN();
  // const nohopes = [] as string[];

  // for (const x of scrappers) {
  //   const d = await x
  //     .getDeclaration()
  //     .url.map(async (e) => await x.axios.get(e).then((e) => e.data))
  //     .map(async (e) => new JSDOM(await e).window.document);

  //   const updates = await Promise.all(d);

  //   const updates2 = await updates.map(x.getUpdates).flat();

  //   const urlsM = [
  //     ...new Set([
  //       // ...specials,
  //       // ...xd,
  //       // ...kcAll,
  //       ...updates2,
  //     ]),
  //   ];

  //   for (const urls of chunk(urlsM, 30)) {
  //     const promises = urls.map(async (url) => {
        
  //       const comic = await x.parseComic(
  //         new JSDOM(await x.axios.get(url).then((e) => e.data)).window.document
  //       );
  //       const eq = await prisma.comic.findUnique({
  //         where: { slug: comic.slug },
  //       });
        
  //       try {
  //         if (eq?.thumb) {
  //           const { status : st}  = await axios.head(eq?.thumb)

       
  
  //         }
          
  //       }catch(e){}

  //       if (!stringIsAValidUrl(comic.thumb, ["http", "https"])) {
  //         console.log(
  //           `[${x.getDeclaration().name}] ${comic.slug} ${
  //             comic.thumb
  //           } is not a valid url`
  //         );
  //         return;
  //       }

  //       const slugTarget = `/${comic.slug}/thumb.jpg`;

  //       try {
  //         const { status } = await x.axios.head(comic.thumb);
  //         console.log(`[${x.getDeclaration().name}] ${comic.slug} : ${status}`);

  //         if (status === 200) {
  //           await bunny.downloadAndUpload(comic.thumb, slugTarget);
  //           await prisma.comic.update({
  //             where: {
  //               slug: comic.slug,
  //             },
  //             data: {
  //               thumb: `https://cdn3.gudangkomik.com${slugTarget}`
  //             },
  //           });
  //         }
  //       } catch (e) {
  //         try {
  //           const { status } = await x.axios.head(
  //             comic.thumb?.replace(
  //               "https://img.statically.io/img/manhwaindo/",
  //               "https://"
  //             )
  //           );
  //           console.log(
  //             `[${x.getDeclaration().name}] ${comic.slug} : ${status}`
  //           );

  //           if (status === 200) {
  //             await bunny.downloadAndUpload(
  //               comic.thumb?.replace(
  //                 "https://img.statically.io/img/manhwaindo/",
  //                 "https://"
  //               ),
  //               slugTarget
  //             );
  //             await prisma.comic.update({
  //               where: {
  //                 slug: comic.slug,
  //               },
  //               data: {
  //                 thumb: `https://cdn3.gudangkomik.com${slugTarget}`
  //               },
  //             });
  //           }
  //         } catch (e) {
  //           console.log(
  //             `[${x.getDeclaration().name}] ${comic.slug} : error ${
  //               comic.thumb
  //             }`
  //           );
  //           nohopes.push(comic.slug);
  //         }
  //       }
  //     });

  //     try {
  //       await Promise.all(promises);
  //     } catch (error) {
        
  //     }
  //   }
  // }

  // console.log(nohopes);

  // for (const comic of await prisma.comic.findMany()) {
  //   try {
  //     const { status } = await axios.head(comic.thumb);
  //     if (status !== 200) {
  //       console.log("comic-thumb not found", comic.thumb);

  //       const thumb = thumbMap.get(comic.slug);
  //       if (thumb) {
  //         console.log("comic-thumb found", thumb);
  //         await prisma.comic.update({
  //           where: { slug: comic.slug },
  //           data: { thumb },
  //         });
  //       }
  //     }
  //   } catch (error) {
  //     console.log("comic-thumb not found", comic.thumb);
  //   }
  // }
}

main();


// import { prisma } from "./modules/Context";
// import axios from "axios";
// import BunnyCDN from "./modules/BunnyCDN";
// import { writeFile } from "node:fs";
// import { Agent } from "node:https";
// import Manhwaindo from "./scrappers/manhwaindo";
// import { JSDOM } from "jsdom";
// import { slugify } from "./modules/Helper";
// import Manhwaland from "./scrappers/manhwaland";
// import Komikcast from "./scrappers/komikcast";
// import { URL, parse } from "url";
// import { chunk } from "lodash";
// import Kitsu from "kitsu";
// const stringIsAValidUrl = (s: string, protocols: string[]) => {
//   try {
//     new URL(s);
//     const parsed = parse(s);
//     return protocols
//       ? parsed.protocol
//         ? protocols.map((x) => `${x.toLowerCase()}:`).includes(parsed.protocol)
//         : false
//       : true;
//   } catch (err) {
//     return false;
//   }
// };

// async function main() {
//   // Kitsu.io's API
//   const api = new Kitsu();
//   const bunny = new BunnyCDN();
//   for (const comic of await prisma.comic.findMany()) {
//     try {
//       const { status } = await axios.head(comic.thumb);

//       if (status == 200) {
//         continue;
//       }
//     } catch (error) { }
    

//     try {
//       const { data } = await api.get("manga", {
//         params: {
//           filter: {
//             text: comic.name,
//           },
//         },
//       });
//       console.log(comic.slug);
//       console.log(data[0]?.canonicalTitle);
//       console.log(data[0]?.posterImage?.original);

//       if (!data[0]?.posterImage?.original) continue;

//       await bunny.downloadAndUpload(
//         data[0]?.posterImage?.original,
//         `/${comic.slug}/thumb.jpg`
//       );

//       await prisma.comic.update({
//         where: {
//           id: comic.id,
//         },
//         data: {
//           thumb: `https://cdn3.gudangkomik.com/${comic.slug}/thumb.jpg`,
//         },
//       });


//       console.log(`${comic.slug} done`);
//     } catch (error) {
//       console.log(error);
//     }
//   }
// }

// main();
