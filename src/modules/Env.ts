if (process.env.WEBPACK != "true") {
  require("dotenv").config();
}

export const APP_ENDPOINT = "https://backend.gudangkomik.com/graphql";
