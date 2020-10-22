"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
var stateKey = "spotify_auth_state";
var client_id = process.env.SPOTIFY_CLIENT_ID; // Your client id
var client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret
var redirect_uri = process.env.SPOTIFY_REDIRECT_URI; // Your redirect uri
var querystring = require("querystring");
module.exports = (app) => {
    app.get("/spotify/callback", function (req, res) {
        // your application requests refresh and access tokens
        // after checking the state parameter
        var code = req.query.code || null;
        var state = req.query.state || null;
        var storedState = req.cookies ? req.cookies[stateKey] : null;
        if (state === null || state !== storedState) {
            res.redirect("/#" +
                querystring.stringify({
                    error: "state_mismatch",
                }));
        }
        else {
            res.clearCookie(stateKey);
            var authOptions = {
                headers: {
                    Authorization: "Basic " +
                        Buffer.from(client_id + ":" + client_secret).toString("base64"),
                },
            };
            axios_1.default
                .post("https://accounts.spotify.com/api/token", querystring.stringify({
                code,
                redirect_uri,
                grant_type: "authorization_code",
            }), authOptions)
                .then((axiosRes) => {
                var access_token = axiosRes.data.access_token, refresh_token = axiosRes.data.refresh_token;
                // use the access token to access the Spotify Web API
                axios_1.default
                    .get("https://api.spotify.com/v1/me", {
                    headers: { Authorization: "Bearer " + access_token },
                })
                    .then((axiosRes) => {
                    //create or load an associated account on firebase
                    console.log(axiosRes.data);
                });
                // // we can also pass the token to the browser to make requests from there
                // res.redirect(
                //   "/#" +
                //     querystring.stringify({
                //       access_token: access_token,
                //       refresh_token: refresh_token,
                //     })
                // );
            })
                .catch((error) => {
                res.redirect("/#" +
                    querystring.stringify({
                        error: "invalid_token",
                    }));
                console.log("error", error);
            });
        }
    });
};
//# sourceMappingURL=callback.js.map