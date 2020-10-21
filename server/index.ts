/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

var express = require("express"); // Express web server framework
// var request = require('request'); // "Request" library
var cors = require("cors");
var cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "/.env") });
const port = process.env.PORT || 3000;

const authRouter = require("./routes/spotify/login");
const callbackRouter = require("./routes/spotify/callback");
const loginRouter = require("./routes/spotify/login");
const refreshRouter = require("./routes/spotify/refresh");

const youtubeSearch = require("./routes/youtube/");

var app = express();

app
  .use(express.static(__dirname + "/public"))
  .use(cors())
  .use(cookieParser());

//Spotify
authRouter(app);
callbackRouter(app);
loginRouter(app);
refreshRouter(app);

//youtube
youtubeSearch(app);
console.log("Listening on 3000");
app.listen(port);
