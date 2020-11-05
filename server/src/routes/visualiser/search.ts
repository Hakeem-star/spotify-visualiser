import axios from "axios";
import youtube from "../youtube";

export default async (app) => {
  app.get("/search/", async (req, res) => {
    console.log("WOO", req.query.spotifyToken);

    let spotifyResponse: any;
    //Spotify call
    try {
      spotifyResponse = await axios.get("https://api.spotify.com/v1/search", {
        params: {
          q: req.query.q,
          type: "track",
          limit: 5,
        },
        headers: {
          Authorization: `Bearer ${req.query.spotifyToken}`,
        },
      });
    } catch (error) {
      console.log("here", error.response.data);
      spotifyResponse = error.response.data;
    }

    let youtubeResponse: any;
    //Youtube call
    try {
      youtubeResponse = await youtube.get("/search", {
        params: { q: req.query.q },
      });
    } catch (error) {
      console.log("here", error.response.data);
      youtubeResponse = error.response.data;
    }

    //If there is data, assign that value, else assign error
    const spotifyResults = spotifyResponse?.data || spotifyResponse;
    const youtubeResults = youtubeResponse?.data || youtubeResponse;

    console.log(spotifyResults);
    res.send({ spotifyResults, youtubeResults });
  });
};
