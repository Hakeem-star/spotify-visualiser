import express from "express";
const port = process.env.PORT || 3000;

export const environment = "DEV";

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
    PROD: "https://spotify-visualiser-293211--preview-name-zwcii31o.web.app/",
  };
  return ENV_URLS[environment];
}

//DISABLE FOR DEV
// const functions = require("firebase-functions");

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
//DISABLE FOR PROD ENV
app.listen(port);

//DISABLE FOR DEV ENV
// exports.app = functions.https.onRequest(app);
