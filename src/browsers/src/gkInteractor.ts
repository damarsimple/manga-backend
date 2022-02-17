import axios from "axios";
import { gql, GraphQLClient } from "graphql-request";
import { host } from "./env";
import { Comic, Chapter, ChapterCandidate } from './types';
import { APP_ENDPOINT } from '../../modules/Env';
import { SECRET_KEY } from '../../modules/Key';
import { slugify } from '../../modules/Helper';


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
          chapters: ChapterCandidate[]

        }
      }>(sanityCheck, { ...comic, slug })
      const chapterscandidate: string[] = [];

      const { chapters, status } = data;

      //@ts-ignore
      const maps = chapters.map(e => parseFloat(e.name))

      for (let i of originalCandidate) {
        //@ts-ignore
        if (!maps.includes(parseFloat(i.name))) {
          chapterscandidate.push(i.href);
        }
      }

      // console.log(`[${comic.name}] Finish Checking ${comic.name} sanityCheck() status: ${status} length: ${chapterscandidate.length}`);


      return {
        status,
        chapterscandidate,
      };

    } catch (error) {
      console.log(error)

      throw error;
    }



  }

  public static async sanityEclipse(title: string, chapter: Chapter) {
    if (chapter.image_count == 0) {
      console.log("no image found");
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
