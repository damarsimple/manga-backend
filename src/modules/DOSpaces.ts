import { PutObjectCommandInput, S3Client } from '@aws-sdk/client-s3';
import { Upload } from "@aws-sdk/lib-storage";
import axios, { AxiosInstance } from 'axios';
import { SPACES_MAIN_KEY, SPACES_SECRET } from './Key';
import sharp from "sharp";

export class DOSpaces {
    private s3Client: S3Client;
    private start = new Date()
    private end = new Date()
    private axios: AxiosInstance

    constructor() {
        if (!SPACES_MAIN_KEY || !SPACES_SECRET) {

            throw Error('SPACES KEY NOT FOUND')

        }
        this.axios = axios.create()


        this.s3Client = new S3Client({
            endpoint: "https://sgp1.digitaloceanspaces.com",
            region: "sgp1",
            credentials: {
                accessKeyId: SPACES_MAIN_KEY,
                secretAccessKey: SPACES_SECRET
            }
        });
    }


    private _time() {
        this.start = new Date()
    }

    private _end() {
        this.end = new Date()
    }

    private getElapsed() {
        this._end();
        return this.end.getTime() - this.start.getTime();
    }




    public async upload(f: Buffer, path: string) {

        if (path.startsWith("/")) path = path.substring(1)


        const params: PutObjectCommandInput = {
            Bucket: "gudangkomik",
            Key: path,
            //@ts-ignore
            Body: f,
            ACL: "public-read",
            Metadata: {
                "x-compress": "webp-q80"
            }
        }

        try {


            // const data = await this.s3Client.send(new PutObjectCommand(params));


            // return data;


            const parallelUploads3 = new Upload({
                client: this.s3Client,
                queueSize: 1, // optional concurrency configuration
                // partSize: 5242880, // optional size of each part
                leavePartsOnError: false, // optional manually handle dropped parts
                params,
            });

            // parallelUploads3.on("httpUploadProgress", (progress) => {
            // console.log(progress);
            // });

            return await parallelUploads3.done();


        } catch (err) {
            console.log("Error", err);
        }
    };
    public async download(url: string): Promise<Buffer> {


        const y = await this.axios.get(url, {
            responseType: "arraybuffer",
        });




        return y.data;

    }

    public async downloadAndUpload(url: string, path: string, pipe?: (e: Buffer) => Promise<Buffer>) {
        this._time();
        try {
            const file = await this.download(url)
            this._end();
            const downloadElapsed = this.getElapsed();
            this._time();

            const result = await this.upload(pipe ? await pipe(file) : file, path)
            this._end();
            console.log(`[BUNNYCDN] 📁 Download ${pipe ? "And Pipe" : ""} finish at ${downloadElapsed} & Uploaded finish at ${this.getElapsed()} https://testcdn.gudangkomik.com${path}`)
            return result

        } catch (error) {
            console.log(`[BUNNYCDN] 📁 Error Download ${url} and Uploading https://testcdn.gudangkomik.com${path}`)

            throw error;
        }

    }


}

async function main() {

    const t = new DOSpaces()

    const compress = async (e: Buffer) => {
        return await sharp(e).webp({
            quality: 80
        }).toBuffer()
    }


    for (let index = 0; index < 10; index++) {
        await t.downloadAndUpload("https://cdn.gudangkomik.com/test.jpg", `/test0${index}.webp`, compress)

    }

}


main()
