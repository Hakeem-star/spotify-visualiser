import axios from "axios";

module.exports = (app) => {
  app.get("/youtube/search/:term", (req, res) => {
    axios
      .get("https://www.googleapis.com/youtube/v3/search", {
        params: {
          part: "snippet",
          maxResults: 5,
          type: "video",
          videoCategoryId: "10", //music category
          key: process.env.YOUTUBE_API_KEY,
          q: req.params.term,
        },
      })

      .then((axiosResponse) => {
        res.send(axiosResponse.data);
        console.log(axiosResponse.data);
      })

      .catch((error) => {
        console.log({ error });
      });
  });
};
