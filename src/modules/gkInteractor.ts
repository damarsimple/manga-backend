import axios from "axios";
import { gql, GraphQLClient } from "graphql-request";
import { host } from "../browsers/src/env";
import { Comic, ChapterCandidate, Chapter as ChapterScrapepr } from '../browsers/src/types';
import { APP_ENDPOINT } from './Env';
import { SECRET_KEY } from './Key';
import { slugify } from './Helper';
import { Chapter } from '@prisma/client';


const client = new GraphQLClient(APP_ENDPOINT, {
  headers: {
    authorization: SECRET_KEY
  }
})


const sanityCheck = gql`
mutation SanityCheck($name: String!, $thumb: String!, $author: String!, $genres: [String], $type: String, $released: String, $description: String, $thumbWide: String) {
  sanityCheck(name: $name, thumb: $thumb, author: $author, genres: $genres, type: $type, released: $released, description: $description, thumbWide: $thumbWide) {
    status
    chapters{
      id
      name
    }
  }
}
`

const sanityEclipse = gql`
mutation SanityEclipse($slug: String!, $chapter: JSONObject) {
  sanityEclipse(slug: $slug, chapter: $chapter){
    status
    message
  }
}
`


const map = new Map()

map.set('megami-no-kafeterasu-goddess-caf-terrace', 'megami-no-kafeterasu')


export class gkInteractor {

  public static async sanityCheck(comic: Comic, originalCandidate: ChapterCandidate[]) {

    // console.log(`[${comic.name}] Checking ${comic.name} sanityCheck()`);

    if (!comic.type) {
      comic.type = "N/A";
    }

    let slug = map.get(comic.slug) || comic.slug;


    try {
      const { sanityCheck: data } = await client.request<{
        sanityCheck: {
          status: string,
          chapters: Chapter[]

        }
      }>(sanityCheck, { ...comic, slug })



      const chapterscandidate: ChapterCandidate[] = [];

      const { chapters, status } = data;

      const maps = chapters.map(e => e.name)



      for (let i of originalCandidate) {
        if (!maps.includes(i.name)) {
          chapterscandidate.push({
            href: i.href,
            name: i.name
          });
        }
      }

      // if (chapterscandidate.length > 0) {
      //   console.log(originalCandidate.sort((a, b) => a.name - b.name));
      //   console.log(maps.sort())
      //   console.log(chapterscandidate)

      // }


      // console.log(`[${comic.name}] Finish Checking ${comic.name} sanityCheck() status: ${status} length: ${chapterscandidate.length}`);


      return {
        status,
        chapterscandidate,
        chaptersList: maps
      };

    } catch (error) {
      console.log(error)

      throw error;
    }



  }


  public static async uploadImage(url: string, path: string) {

    try {
      const { data: {
        status,
        message
      } } = await axios.post(`${host}/upload`, {
        url,
        path
      })

      if (status) {
        console.log(`Success Upload ${message}`);
      }


      return true;

    } catch (error) {
      throw error;
    }

  }

  public static async sanityEclipse(title: string, chapter: ChapterScrapepr) {
    //@ts-ignore
    if (chapter.image_count == 0) {
      console.log(`no image found for ${title} ${chapter.name} `);
      return;
    }

    let slug = map.get(slugify(title)) || slugify(title);


    const { sanityEclipse: {
      status,
      message
    } = {} } = await client.request<{
      sanityEclipse: {
        status: boolean;
        message: string
      }
    }>(sanityEclipse, { slug, chapter })


    if (status) {
      console.log(`Success SanityEclipse ${message}`);
    } else {
      console.log(`Failed SanityEclipse ${message}`);
    }

    return;
  }
}
