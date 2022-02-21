import BunnyCDN from './modules/BunnyCDN';

async function main() {

    const b = new BunnyCDN();

    const axios = b.getAxios()

    const start = new Date().getTime();

    const x = await b.download("https://cdn.gudangkomik.com/test.jpg");

    console.log(`${new Date().getTime() - start}`);


    // const d = await axios.get("https://sg.storage.bunnycdn.com/komikgudang/07-ghost/?download")

    // console.log(d.data)


}

main()