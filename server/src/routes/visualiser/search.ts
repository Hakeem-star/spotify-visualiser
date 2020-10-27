import axios from "axios";
import youtube from "../youtube";

export default async (app) => {
  app.get("/search/", async (req, res) => {
    console.log("WOO", req.query.spotifyToken);
    const songs = await axios
      .all([
        axios.get("https://api.spotify.com/v1/search", {
          params: {
            q: req.query.q,
            type: "track",
            limit: 5,
          },
          headers: {
            Authorization: `Bearer ${req.query.spotifyToken}`,
          },
        }),

        youtube.get("/search", {
          params: { q: req.query.q },
        }),
      ])
      .catch((e) => {
        console.log(req.cookies, e.response.data);
        res.send([e, e.response.data]);
      });

    const spotifyresults = songs[0];
    const youtubeResults = songs[1];

    console.log(spotifyresults.data.tracks);
    console.log(youtubeResults.data.items);
    res.send([spotifyresults.data.tracks, youtubeResults.data]);

    //   .then((axiosResponse) => {
    //     res.send(axiosResponse.data);
    //     console.log(axiosResponse.data);
    //   })

    //   .catch((error) => {
    //     console.log({ error });
    //   });
  });
};
