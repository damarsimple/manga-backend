import { Comic, Chapter } from "../browsers/src/types";
import { slugify } from "../modules/Helper";
import { Scrapper } from "./scrapper";

export class Komikcast extends Scrapper {

    constructor() {
        super({
            axiosDefault: {
                baseURL: "https://apk.nijisan.my.id",

            },
            useProxyDownload: true
        });




    }

    public getUpdates() {

        return new Promise<string[]>(async (resolve, reject) => {
            const slugs = [];

            for (let index = 1; index <= 6; index++) {
                for (let j = 1; j <= 6; j++) {
                    try {

                        const { data } = await this.axios.get<UpdateResponse.RootObject>(`/premium/home/latest/${index}/${j}`)

                        for (const x of data.data) {
                            slugs.push(x.linkId)
                        }
                    } catch (error) {

                        reject(error)

                    }

                }

            }

            resolve(slugs)

        });

    }
    public getComic(url: string) {
        return new Promise<Comic>(async (resolve, reject) => {

            try {
                const { data } = await this.axios.get<ComicResponse.RootObject>(`/komik/info/${url}`)

                const comic: Comic = {
                    name: data.title?.replace("Bahasa Indonesia", "")?.trim(),
                    alt_name: data.title_other?.split(",")?.map(e => e.trim()),
                    slug: slugify(data?.title?.replace("Bahasa Indonesia", "")?.trim()),
                    genres: data.genres?.map(e => e.trim()),
                    rating: data.rating,
                    thumb: data.image,
                    thumb_wide: data.image2,
                    isHentai: false,
                    author: data.author,
                    colored: false,
                    chapters: data.list_chapter?.map(e => ({
                        name: parseFloat(e.ch ?? 0),
                        href: e.linkId
                    })),
                    type: data.type?.replace("Type: ", "")
                };

                resolve(comic);

            } catch (error) {
                reject(error)
            }



        });
    }
    public getChapter(url: string) {
        return new Promise<Chapter>(async (resolve, reject) => {

            try {
                const { data } = await this.axios.get<ChapterResponse.RootObject>(`/komik/info/${url}`)

                const comic: Chapter = {
                    name: parseFloat(data.ch ?? 0),
                    image_count: data.images.length,
                    original_image_count: data.images.length,
                    processed: false,
                    images: data.images,
                    quality: 0
                };

                resolve(comic);

            } catch (error) {
                reject(error)
            }



        });

    }


}

declare module UpdateResponse {

    export interface Datum {
        title: string;
        ch: string;
        rating: string;
        image: string;
        image2: string;
        type: string;
        isCompleted: string;
        link: string;
        linkId: string;
        isHot: string;
        ch_id: string;
        ch_time: string;
    }

    export interface RootObject {
        total_page: number;
        total_data: number;
        data: Datum[];
    }

}

declare module ComicResponse {

    export interface ListChapter {
        ch: string;
        time_release: string;
        linkId: string;
    }

    export interface RootObject {
        linkid: string;
        title: string;
        title_other: string;
        author: string;
        image: string;
        image2: string;
        rating: string;
        sinopsis: string;
        type: string;
        status: string;
        released: string;
        total_chapter: string;
        updated_on: string;
        genres: string[];
        list_chapter: ListChapter[];
    }

}


declare module ChapterResponse {

    export interface RootObject {
        title: string;
        ch: string;
        comic_title: string;
        prev_ch: string;
        next_ch: string;
        prev_link_id: string;
        next_link_id: string;
        images: string[];
    }

}

