import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import Logger from "./Logger";
import FormDataNode from "form-data";
import fs, { ReadStream } from "fs";
const isNode =
  typeof process !== "undefined" && process.release.name === "node";
interface BunnyConstructor {
  log: boolean;
  axiosDefault?: AxiosRequestConfig;
}
export default class BunnyCDN {
  private start = new Date();
  private end = new Date();
  private axiosDown: AxiosInstance;
  private axiosUp: AxiosInstance;
  private log: boolean;

  private BASE_URL = "http://simplecdn1.damaral.my.id:4000/upload";
  private BASE_CDN_URL = "https://cdn1.gudangkomik.com";

  constructor(init?: BunnyConstructor) {
    const { log, axiosDefault } = init || {};

    this.log = log || false;

    // this.axios.interceptors.response.use((e) => {
    //     logger.error(`SCRAPPER Error : 📁 ${e.config.url}, ${e.status} , ${e.statusText} `)
    // });

    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36",
      AccessKey: "77948c15-c80a-4cbb-8e6a810c693b-6889-47f6",
      "Content-Type": "application/octet-stream",
    };

    this.axiosDown = axios.create({
      ...axiosDefault,
      headers,
    });

    this.axiosUp = axios.create({
      headers,
    });

    this.axiosDown.get("https://api.myip.com").then((e) => console.log(e.data));
  }

  private _time() {
    this.start = new Date();
  }

  private _end() {
    this.end = new Date();
  }

  private getElapsed() {
    this._end();
    return this.end.getTime() - this.start.getTime();
  }

  private filenameGueser(url: string) {
    return url.substring(url.lastIndexOf("/") + 1);
  }

  public async download(u: string): Promise<ReadStream | Blob> {
    let url: string;

    if (u.includes("https://img.statically.io/img/manhwaindo/")) {
      //https://img.statically.io/img/manhwaindo/cdn.kambingjantan.cc/f=auto/storage/drive/fxlX1F5ybiEwDk6gHMQ640ZVEbwSNy/4QFD8Yh3vQ8V8I3NLXfyZGW2Tl6A3m/8GUuMB9qXuMbNS8YsLlX50xl0zDoRq.jpg
      url = u
        .replace("https://img.statically.io/img/manhwaindo/", "https://")
        .replace("/f=auto", "");
    } else {
      url = u;
    }

    const y = await this.axiosDown.get(url, {
      responseType: isNode ? "stream" : "blob",
    });

    return y.data;
  }

  blobToFile = (theBlob: Blob, fileName: string): File => {
    var b: any = theBlob;
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.name = fileName;

    //Cast to a File() type
    return <File>theBlob;
  };

  public async upload(file: ReadStream | Blob, saveToPath: string) {
    this._time();
    const filename = this.filenameGueser(saveToPath);
    const path = saveToPath.replace(filename, "");

    this.log &&
      console.log(`${isNode ? "node" : "browser"} ${filename} ${path}`);

    try {
      let form;
      let headers = {};
      if (isNode) {
        form = new FormDataNode();
        form.append("file", file as ReadStream, {
          filename: this.filenameGueser(path),
        });
        form.append("directory", path);
        form.append("filename", filename);

        headers = form.getHeaders ? form.getHeaders() : {};
      } else {
        form = new FormData();
        headers = {};
        form.append(
          "file",
          this.blobToFile(file as Blob, this.filenameGueser(path)),
          this.filenameGueser(path)
        );
        form.append("directory", path);
        form.append("filename", filename);
      }

      const res = await this.axiosUp
        .post(this.BASE_URL, form, {
          headers: {
            ...headers,
            // "Content-Length": bodyFormData.getLengthSync(),
          },
        })
        .then((e) => {
          this.log && console.log(e.data);
        })
        .catch(function (error) {
          console.log(error.response.data);
          console.log("Error", error.message);
        });

      return true;
    } catch (error) {
      console.log(`${saveToPath} error upload ${error} `);
      throw error;
    }
  }

  public async downloadAndUpload(
    url: string,
    path: string,
    pipe?: (e: Buffer) => Promise<Buffer>
  ) {
    this._time();
    try {
      const file = await this.download(url);
      this._end();
      const downloadElapsed = this.getElapsed();
      this._time();
      this.log && console.log(`${url} download ${downloadElapsed}ms`);
      const result = await this.upload(file, path);
      this._end();
      this.log &&
        this.log &&
        console.log(
          `[BUNNYCDN] 📁 Download ${
            pipe ? "And Pipe" : ""
          } finish at ${downloadElapsed} & Uploaded finish at ${this.getElapsed()} ${this.BASE_CDN_URL}${path}`
        );
      return result;
    } catch (error) {
      this.log &&
        console.log(
          `[BUNNYCDN] 📁 [Error] Download ${url} and Uploading ${this.BASE_CDN_URL}${path}`
        );

      throw error;
    }
  }

  public getAxios() {
    return this.axiosDown;
  }
}
