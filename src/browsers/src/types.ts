export interface Comic {
    name: string;
    alt_name: string[];
    slug: string;
    genres: string[];
    description?: string;
    status?: string;
    rating: string;
    thumb: string;
    thumb_wide?: string;
    isHentai: boolean;
    released?: Date;

    author: string;
    colored: boolean;

    age?: string;
    type?: string;
    concept?: string;

    chapters: ChapterCandidate[]

}

export interface Chapter {
    name: number;
    image_count: number;
    original_image_count: number;

    processed: boolean;

    images: string[];
    quality: number

}

export interface ChapterCandidate {
    name: number
    href: string
}
export interface ImageChapter {
    url: string;
    path: string;
}