"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const functions = require("firebase-functions");
var cors = require("cors");
var cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "/.env") });
const port = process.env.PORT || 3000;
const callback_1 = __importDefault(require("./routes/spotify/callback"));
const login_1 = __importDefault(require("./routes/spotify/login"));
const refresh_1 = __importDefault(require("./routes/spotify/refresh"));
const login_2 = __importDefault(require("./routes/visualiser/login"));
const search_1 = __importDefault(require("./routes/visualiser/search"));
var app = express_1.default();
app
    .use(express_1.default.static(__dirname + "/public"))
    .use(cors())
    .use(cookieParser());
//Spotify
login_1.default(app);
callback_1.default(app);
refresh_1.default(app);
//visualiser
login_2.default(app);
search_1.default(app);
console.log("Listening on 3000");
//Disable app.listen in deployed version
app.listen(port);
exports.app = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map