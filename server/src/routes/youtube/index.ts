import axios from "axios";

export default axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3",
  params: {
    part: "snippet",
    maxResults: 5,
    type: "video",
    videoCategoryId: "10", //music category
    key: process.env.YOUTUBE_API_KEY,
  },
});
