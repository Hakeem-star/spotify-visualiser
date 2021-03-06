import axios from "axios";
var client_id = process.env.SPOTIFY_CLIENT_ID; // Your client id
var client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret
var querystring = require("querystring");

export default (app) => {
  app.get("/api/spotify/refresh_token", function (req, res) {
    // requesting access token from refresh token
    var refresh_token = req.query.refresh_token;
    console.log({ refresh_token: req.query });
    var authOptions = {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(client_id + ":" + client_secret).toString("base64"),
      },
    };

    axios
      .post(
        "https://accounts.spotify.com/api/token",
        querystring.stringify({
          grant_type: "refresh_token",
          refresh_token: refresh_token,
        }),
        authOptions
      )
      .then((axiosRes) => {
        console.log({ axiosRes });
        // res.cookie("ACCESS_TOKEN", access_token);
        res.send({
          access_token: axiosRes.data.access_token,
          expires_in: axiosRes.data.expires_in,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  });
};
