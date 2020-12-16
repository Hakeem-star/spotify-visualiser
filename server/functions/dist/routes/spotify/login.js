"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stateKey = "spotify_auth_state";
var client_id = process.env.SPOTIFY_CLIENT_ID; // Your client id
var redirect_uri = process.env.SPOTIFY_REDIRECT_URI; // Your redirect uri
var querystring = require("querystring");
/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function (length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};
exports.default = (app) => {
    app.get("/spotify/login", function (req, res) {
        var state = generateRandomString(16);
        res.cookie(stateKey, state);
        // your application requests authorization
        var scope = "streaming user-read-private user-read-email user-top-read";
        res.redirect("https://accounts.spotify.com/authorize?" +
            querystring.stringify({
                response_type: "code",
                client_id: client_id,
                scope: scope,
                redirect_uri: redirect_uri,
                state: state,
            }));
    });
};
//# sourceMappingURL=login.js.map