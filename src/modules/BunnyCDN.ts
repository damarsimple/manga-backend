import axios, { AxiosInstance } from "axios"
import Logger from "./Logger";

const logger = new Logger();

interface BunnyConstructor { log: boolean }
export default class BunnyCDN {

    private start = new Date()
    private end = new Date()
    private axios: AxiosInstance
    private log: boolean;

    constructor(init?: BunnyConstructor) {
        this.axios = axios.create({
            headers: {
                AccessKey: "77948c15-c80a-4cbb-8e6a810c693b-6889-47f6",
                "Content-Type": "application/octet-stream",
            },
        })

        const { log } = init || {};

        this.log = log || false;

        // this.axios.interceptors.response.use((e) => {
        //     logger.error(`SCRAPPER Error : 📁 ${e.config.url}, ${e.status} , ${e.statusText} `)
        // })
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


    private filenameGueser(url: string) {
        return url.substring(url.lastIndexOf("/") + 1);
    }

    public async download(url: string): Promise<Buffer> {

        const y = await this.axios.get(url, {
            responseType: "arraybuffer",
        });

        return y.data;
    }

    public async upload(file: ArrayBuffer, path: string) {
        this._time();

        try {
            const tobeSaved = `https://sg.storage.bunnycdn.com/komikgudang${path}`;
            const tobePurged = `https://cdn.gudangkomik.com${path}`;

            const res = await this.axios.put(tobeSaved, file);



            return await res.data;


        } catch (error) {
            console.log(`${path} error upload ${error} `)
            throw error;
        }

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
            this.log && console.log(`[BUNNYCDN] 📁 Download ${pipe ? "And Pipe" : ""} finish at ${downloadElapsed} & Uploaded finish at ${this.getElapsed()} https://cdn.gudangkomik.com${path}`)
            return result

        } catch (error) {
            console.log(`[BUNNYCDN] 📁 [Error] Download ${url} and Uploading https://cdn.gudangkomik.com${path} ${error}`)

            throw error;
        }

    }


    public getAxios() {
        return this.axios
    }
}