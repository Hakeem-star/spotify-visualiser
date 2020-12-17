import express from "express";
const port = process.env.PORT || 3000;
//CHANGE FOR ENVIRONEMNT "DEV" OR "PROD"
export let environment = "DEV";

export function envServerURL() {
  const ENV_URLS = {
    DEV: `http://localhost:${port}`,
    PROD:
      "https://us-central1-spotify-visualiser-293211.cloudfunctions.net/app",
  };
  return ENV_URLS[environment];
}

export function envWebsiteURL() {
  const ENV_URLS = {
    DEV: `http://localhost:4000`,
    PROD: "https://spotify-visualiser-293211.web.app/",
    // "https://spotify-visualiser-293211--preview-name-zwcii31o.web.app/",
  };
  return ENV_URLS[environment];
}

let functions;

if (environment === "PROD") {
  functions = require("firebase-functions");
}

var cors = require("cors");
var cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "/.env") });

import callbackRouter from "./routes/spotify/callback";
import loginRouter from "./routes/spotify/login";
import refreshRouter from "./routes/spotify/refresh";

import loginVisualiser from "./routes/visualiser/login";
import search from "./routes/visualiser/search";

var app = express();
app
  .use(express.static(__dirname + "/public"))

  .use(
    cors({
      origin: "*",
    })
  )
  .use(cookieParser());

//Spotify
loginRouter(app);
callbackRouter(app);
refreshRouter(app);

//visualiser
loginVisualiser(app);
search(app);

console.log("Listening on 3000");

if (environment === "PROD") {
  exports.app = functions.https.onRequest(app);
} else {
  app.listen(port);
}
