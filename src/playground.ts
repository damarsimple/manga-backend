import BunnyCDN from "./modules/BunnyCDN";

async function main() {
  const bunnycdn = new BunnyCDN();

  console.log(
    await bunnycdn.downloadAndUpload(
      "https://cdn.gudangkomik.com/battle-through-the-heavens/368/0.jpg",
      "/damar/test/test.jpg"
    )
  );
}

main();
