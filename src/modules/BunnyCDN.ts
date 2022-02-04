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

    private _log(e: "download" | "upload", extra: string) {
        logger.info(`${e == "download" ? "📁 Upload " : "📁 Download"} finished at ${this.getElapsed()}ms ${extra}`)
    }

    private filenameGueser(url: string) {
        return url.substring(url.lastIndexOf("/") + 1);
    }

    public async download(url: string) {
        try {
            this._time();

            const y = await this.axios.get(url, {
                responseType: "arraybuffer",
            });


            this._log("download", this.filenameGueser(url))


            return y.data as ArrayBuffer;
        } catch (error) {

            try {


                console.log('trying special mitigation 403 manhwaindo ...')

                const y = await this.axios.get(url.replace("img.statically.io/img/manhwaindo/", ""), {
                    responseType: "arraybuffer",
                });


                this._log("download", this.filenameGueser(url))


                return y.data as ArrayBuffer;

            } catch (error) {

                console.error(error);
                console.log(url)
                throw error;

            }


        }
    }

    public async upload(file: ArrayBuffer, path: string) {
        this._time();

        try {
            const tobeSaved = `https://sg.storage.bunnycdn.com/komikgudang${path}`;

            // await axios.get(`https://api.bunny.net/purge?url=${tobeSaved}`, {
            //     headers: {
            //         AccessKey: "b7405229-91f9-483b-811f63397040-ad00-4247",
            //     }
            // })


            if (typeof process != "undefined") {
                const res = await axios.put(tobeSaved, Buffer.from(file)
                    , {
                        headers: {
                            AccessKey: "b7405229-91f9-483b-811f63397040-ad00-4247",
                        },
                    });


                this._log("upload", this.filenameGueser(tobeSaved))

                return await res.data;
            } else {
                const res = await fetch(tobeSaved, {
                    method: "PUT",
                    body: file,
                    headers: {
                        AccessKey: "b7405229-91f9-483b-811f63397040-ad00-4247",
                        "Content-Type": "application/octet-stream",
                    },
                });


                this._log("upload", this.filenameGueser(tobeSaved))

                return await res.json();
            }
        } catch (error) {
            console.error(error);
            throw error;
        }

    }


    public async downloadAndUpload(url: string, path: string) {
        const file = await this.download(url)
        const result = await this.upload(file, path)


        return result

    }

}