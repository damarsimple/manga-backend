import axios, { AxiosInstance } from "axios"
import Logger from "./Logger";

const logger = new Logger();

export default class BunnyCDN {

    private start = new Date()
    private end = new Date()
    private axios: AxiosInstance


    constructor() {
        this.axios = axios.create()

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

    public async download(url: string) {
        try {


            const y = await this.axios.get(url, {
                responseType: "blob",
            });



            return y.data as ArrayBuffer;
        } catch (error) {

            try {


                console.log('trying special mitigation 403 manhwaindo ...')

                const y = await this.axios.get(url.replace("img.statically.io/img/manhwaindo/", ""), {
                    responseType: "arraybuffer",
                });


                return y.data as ArrayBuffer;

            } catch (error) {

                console.log(`${url} error download ${error} `)
                throw error;

            }


        }
    }

    public async upload(file: ArrayBuffer, path: string) {
        this._time();

        try {
            const tobeSaved = `https://sg.storage.bunnycdn.com/komikgudang${path}`;
            const tobePurged = `https://cdn.gudangkomik.com${path}`;


            const res = await axios.put(tobeSaved, file
                , {
                    headers: {
                        AccessKey: "77948c15-c80a-4cbb-8e6a810c693b-6889-47f6",
                        "Content-Type": "application/octet-stream",
                    },
                });



            return await res.data;

            // if (typeof process != "undefined") {
            //     const res = await axios.put(tobeSaved, Buffer.from(file)
            //         , {
            //             headers: {
            //                 AccessKey: "77948c15-c80a-4cbb-8e6a810c693b-6889-47f6",
            //             },
            //         });



            //     return await res.data;
            // } else {
            //     const res = await fetch(tobeSaved, {
            //         method: "PUT",
            //         body: file,
            //         headers: {
            //             AccessKey: "77948c15-c80a-4cbb-8e6a810c693b-6889-47f6",
            //             "Content-Type": "application/octet-stream",
            //         },
            //     });

            //     const ret = await res.json()

            //     if (ret.HttpCode == 400) {
            //         throw new Error(`Bad Request ${ret.Message} ${path}`)
            //     }

            //     if (ret)
            //         await axios.post(tobePurged, {
            //             headers: {
            //                 AccessKey: "99bef15d-1931-4e36-869e-747941ed0ab0",
            //             }
            //         })



            //     return ret;
            // }
        } catch (error) {
            console.log(`${path} error download ${error} `)
            throw error;
        }

    }


    public async downloadAndUpload(url: string, path: string) {
        this._time();
        try {
            console.log(`[BUNNYCDN] 📁 Download and Uploading https://cdn.gudangkomik.com/${path}`)
            const file = await this.download(url)
            this._end();
            const downloadElapsed = this.getElapsed();
            this._time();
            const result = await this.upload(file, path)
            this._end();
            console.log(`[BUNNYCDN] 📁 Download finish at ${downloadElapsed} & Uploaded finish at ${this.getElapsed()} https://cdn.gudangkomik.com/${path}`)
            return result

        } catch (error) {
            console.log(`[BUNNYCDN] 📁 Error Download ${url} and Uploading https://cdn.gudangkomik.com/${path}`)

            throw error;
        }

    }

}