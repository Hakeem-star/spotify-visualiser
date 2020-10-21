"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
module.exports = (app) => {
    app.get("/youtube/search/:term", (req, res) => {
        axios_1.default
            .get("https://www.googleapis.com/youtube/v3/search", {
            params: {
                part: "snippet",
                maxResults: 5,
                type: "video",
                videoCategoryId: "10",
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
//# sourceMappingURL=index.js.map