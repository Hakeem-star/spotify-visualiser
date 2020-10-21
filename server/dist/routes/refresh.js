"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
var client_id = process.env.SPOTIFY_CLIENT_ID; // Your client id
var client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret
var querystring = require("querystring");
module.exports = (app) => {
    app.get("/refresh_token", function (req, res) {
        // requesting access token from refresh token
        var refresh_token = req.query.refresh_token;
        var authOptions = {
            headers: {
                Authorization: "Basic " +
                    Buffer.from(client_id + ":" + client_secret).toString("base64"),
            },
        };
        axios_1.default
            .post("https://accounts.spotify.com/api/token", querystring.stringify({
            grant_type: "refresh_token",
            refresh_token: refresh_token,
        }), authOptions)
            .then((axiosRes) => {
            var access_token = axiosRes.data.access_token;
            res.send({
                access_token: access_token,
            });
        })
            .catch((error) => {
            console.log(error);
        });
    });
};
//# sourceMappingURL=refresh.js.map