import axios from "axios";
import formatYTDuration from "../../utils/formatYTDuration";
import formatMsToHMS from "../../utils/formatMsToHMS";

import youtube from "../youtube";

import * as youtubeJSONResponse from "./youtubeResponse.json";
import * as mockResponse from "./mockResponse.json";

export default async (app) => {
  app.get("/search/", async (req, res) => {
    //   // console.log("WOO", req.query.spotifyToken);
    //   const {
    //     spotifyToken,
    //     sources,
    //   }: {
    //     spotifyToken: string | undefined;
    //     sources: (string | number | undefined)[];
    //   } = req.query;
    //   let spotifyResponse: any;
    //   console.log({ sources });
    //   if (sources.includes("SPOTIFY")) {
    //     //Spotify call
    //     try {
    //       spotifyResponse = await axios.get("https://api.spotify.com/v1/search", {
    //         params: {
    //           q: req.query.q,
    //           type: "track",
    //           limit: 30,
    //         },
    //         headers: {
    //           Authorization: `Bearer ${spotifyToken}`,
    //         },
    //       });
    //       // console.log(spotifyResponse.data.tracks.items);
    //       //Convert duration format
    //       spotifyResponse.data.tracks.items.forEach((item) => {
    //         item.duration = formatMsToHMS(item.duration_ms);
    //       });
    //     } catch (error) {
    //       console.log("here", error?.response?.data);
    //       spotifyResponse = error.response.data;
    //     }
    //   }

    //   //We need to make another search after these results if we want to get the video duration
    //   let youtubeResponse: any;
    //   let youtubeVideoSearchResponse: any;
    //   if (sources.includes("YOUTUBE")) {
    //     //Youtube call
    //     console.log({ QQQ: req.query.q });
    //     try {
    //       youtubeResponse = await youtube.get("/search", {
    //         params: { q: req.query.q, part: "snippet" },
    //       });

    //       const id = youtubeResponse.data.items
    //         .map((item) => item.id.videoId)
    //         .join();

    //       //Get duration for video
    //       youtubeVideoSearchResponse = await youtube.get("/videos", {
    //         params: { q: req.query.q, part: "contentDetails", id },
    //       });
    //     } catch (error) {
    //       console.log("here", error?.response?.data);
    //       youtubeResponse = error.response.data;
    //     }

    //     youtubeResponse.data.items.map((item) => {
    //       const duration = youtubeVideoSearchResponse.data.items.find(
    //         (videoItem) => videoItem.id === item.id.videoId
    //       ).contentDetails.duration;

    //       console.log({
    //         duration: youtubeVideoSearchResponse.data.items.find(
    //           (videoItem) => videoItem.id === item.id.videoId
    //         ),
    //       });
    //       item.duration = formatYTDuration(duration);
    //     });
    //   }
    //   //If there is data, assign that value, else assign error
    //   const spotifyResults = spotifyResponse?.data?.tracks || spotifyResponse;
    //   const youtubeResults = youtubeResponse?.data || youtubeResponse;

    //   // console.log(spotifyResults, youtubeResults);
    //   res.send({ spotifyResults, youtubeResults });
    res.send(mockResponse);
    // res.send({
    //   youtubeResults: youtubeJSONResponse,
    //   // spotifyResults: youtubeJSONResponse,
    // });
  });
};
