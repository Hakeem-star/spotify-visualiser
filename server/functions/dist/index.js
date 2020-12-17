"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envWebsiteURL = exports.envServerURL = exports.environment = void 0;
const express_1 = __importDefault(require("express"));
const port = process.env.PORT || 3000;
exports.environment = "DEV";
function envServerURL() {
    const ENV_URLS = {
        DEV: `http://localhost:${port}`,
        PROD: "https://us-central1-spotify-visualiser-293211.cloudfunctions.net/app",
    };
    return ENV_URLS[exports.environment];
}
exports.envServerURL = envServerURL;
function envWebsiteURL() {
    const ENV_URLS = {
        DEV: `http://localhost:4000`,
        PROD: "https://spotify-visualiser-293211--preview-name-zwcii31o.web.app/",
    };
    return ENV_URLS[exports.environment];
}
exports.envWebsiteURL = envWebsiteURL;
//DISABLE FOR DEV
// const functions = require("firebase-functions");
var cors = require("cors");
var cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "/.env") });
const callback_1 = __importDefault(require("./routes/spotify/callback"));
const login_1 = __importDefault(require("./routes/spotify/login"));
const refresh_1 = __importDefault(require("./routes/spotify/refresh"));
const login_2 = __importDefault(require("./routes/visualiser/login"));
const search_1 = __importDefault(require("./routes/visualiser/search"));
var app = express_1.default();
app
    .use(express_1.default.static(__dirname + "/public"))
    .use(cors({
    origin: "*",
}))
    .use(cookieParser());
//Spotify
login_1.default(app);
callback_1.default(app);
refresh_1.default(app);
//visualiser
login_2.default(app);
search_1.default(app);
console.log("Listening on 3000");
//DISABLE FOR PROD ENV
app.listen(port);
//DISABLE FOR DEV ENV
// exports.app = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map