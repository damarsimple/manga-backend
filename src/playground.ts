import BunnyCDN from './modules/BunnyCDN';

async function main() {

    const b = new BunnyCDN();

    const axios = b.getAxios()

    const d = await axios.get("https://sg.storage.bunnycdn.com/komikgudang/07-ghost/?download")

    console.log(d.data)


}

main()