import axios from "axios";
import { gql, GraphQLClient } from "graphql-request";
import { host } from "./env";
import { Comic, Chapter, ChapterCandidate } from './types';
import { APP_ENDPOINT } from '../../modules/Env';
import { SECRET_KEY } from '../../modules/Key';


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
mutation SanityEclipse($name: String!, $chapter: JSONObject) {
  sanityEclipse(name: $name, chapter: $chapter)
}
`



export class gkInteractor {

  public static async sanityCheck(comic: Comic, originalCandidate: ChapterCandidate[]) {

    // console.log(`[${comic.name}] Checking ${comic.name} sanityCheck()`);

    if (!comic.type) {
      comic.type = "N/A";
    }

    try {
      const { sanityCheck: data } = await client.request<{
        sanityCheck: {

          status: string,
          chapters: ChapterCandidate[]

        }
      }>(sanityCheck, comic)
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
    const { sanityEclipse: data } = await client.request<{ sanityEclipse: boolean }>(sanityEclipse, { name: title, chapter })


    if (data) {
      console.log(`Success SanityEclipse ${title} ${chapter.name}`);
    } else {
      console.log(`Failed SanityEclipse ${title} ${chapter.name} ${data}`);;
    }

    return;
  }
}
