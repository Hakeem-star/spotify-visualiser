import axios from "axios";
import youtube from "../youtube";

import * as youtubeJSONResponse from "./youtubeResponse.json";

export default async (app) => {
  app.get("/search/", async (req, res) => {
    // console.log("WOO", req.query.spotifyToken);
    const {
      spotifyToken,
      sources,
    }: {
      spotifyToken: string | undefined;
      sources: (string | number | undefined)[];
    } = req.query;
    let spotifyResponse: any;
    console.log({ sources });
    if (sources.includes("SPOTIFY")) {
      //Spotify call
      try {
        spotifyResponse = await axios.get("https://api.spotify.com/v1/search", {
          params: {
            q: req.query.q,
            type: "track",
            limit: 30,
          },
          headers: {
            Authorization: `Bearer ${spotifyToken}`,
          },
        });
      } catch (error) {
        console.log("here", error.response.data);
        spotifyResponse = error.response.data;
      }
    }

    let youtubeResponse: any;
    if (sources.includes("YOUTUBE")) {
      //Youtube call
      console.log({ QQQ: req.query.q });
      try {
        youtubeResponse = await youtube.get("/search", {
          params: { q: req.query.q },
        });
      } catch (error) {
        console.log("here", error.response.data);
        youtubeResponse = error.response.data;
      }
    }
    //If there is data, assign that value, else assign error
    const spotifyResults = spotifyResponse?.data?.tracks || spotifyResponse;
    const youtubeResults = youtubeResponse?.data || youtubeResponse;

    console.log(spotifyResults, youtubeResults);
    res.send({ spotifyResults, youtubeResults });
    // res.send({
    //   youtubeResults: youtubeJSONResponse,
    //   // spotifyResults: youtubeJSONResponse,
    // });
  });
};
