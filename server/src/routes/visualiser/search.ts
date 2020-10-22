import axios from "axios";
import youtube from "../youtube";

export default async (app) => {
  app.get("/search/:title", async (req, res) => {
    const songs = await axios
      .all([
        axios.get("https://api.spotify.com/v1/search", {
          params: {
            q: req.params.title,
            type: "track",
            limit: 5,
          },
          headers: {
            Authorization: `Bearer ${req.cookies.ACCESS_TOKEN}`,
          },
        }),

        youtube.get("/search", {
          params: { q: req.params.title },
        }),
      ])
      .catch((e) => {
        console.log(e.response.data);
        res.send([e, e.response.data]);
      });

    const spotifyresults = songs[0];
    const youtubeResults = songs[1];

    console.log(spotifyresults.data.tracks);
    console.log(youtubeResults.data.items);
    res.send([spotifyresults.data.tracks.items, youtubeResults.data.items]);

    //   .then((axiosResponse) => {
    //     res.send(axiosResponse.data);
    //     console.log(axiosResponse.data);
    //   })

    //   .catch((error) => {
    //     console.log({ error });
    //   });
  });
};
