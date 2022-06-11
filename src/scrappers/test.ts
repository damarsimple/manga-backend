import BunnyCDN from "../modules/BunnyCDN";
import HttpsProxyAgent from "https-proxy-agent";
import axios from "axios";
const httpsAgent = HttpsProxyAgent({ host: "localhost", port: "8191" });

const bunny = new BunnyCDN({
  // downloadResponseType: "blob",
  log: true,
  //@ts-ignoresassassss
  axiosDefault: {
    httpsAgent,
  },
});

const d = axios.create({
  httpsAgent,
});

async function name() {
  console.log("nice");

  console.log(
    await d.get("https://api.myip.com").then((e) => console.log(e.data))
  );
  console.log("nice");
}

name().then(() => console.log("finished"));
