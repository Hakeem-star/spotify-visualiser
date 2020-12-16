import express from "express";

const functions = require("firebase-functions");

var cors = require("cors");
var cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "/.env") });
const port = process.env.PORT || 3000;

import callbackRouter from "./routes/spotify/callback";
import loginRouter from "./routes/spotify/login";
import refreshRouter from "./routes/spotify/refresh";

import loginVisualiser from "./routes/visualiser/login";
import search from "./routes/visualiser/search";

var app = express();
app
  .use(express.static(__dirname + "/public"))

  .use(cors())
  .use(cookieParser());

//Spotify
loginRouter(app);
callbackRouter(app);
refreshRouter(app);

//visualiser
loginVisualiser(app);
search(app);

console.log("Listening on 3000");
app.listen(port);

exports.app = functions.https.onRequest(app);
