"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const formatYTDuration_1 = __importDefault(require("../../utils/formatYTDuration"));
const formatMsToHMS_1 = __importDefault(require("../../utils/formatMsToHMS"));
const youtube_1 = __importDefault(require("../youtube"));
exports.default = (app) => __awaiter(void 0, void 0, void 0, function* () {
    app.get("/api/search/popular", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        const { spotifyToken, sources, region = "US", } = req.query;
        let spotifyResponse;
        console.log({ sources });
        if (sources.includes("SPOTIFY")) {
            //Spotify call
            try {
                spotifyResponse = yield axios_1.default.get("https://api.spotify.com/v1/me/top/tracks", {
                    params: {
                        limit: 30,
                    },
                    headers: {
                        Authorization: `Bearer ${spotifyToken}`,
                    },
                });
                //Convert duration format
                spotifyResponse.data.items.forEach((item) => {
                    item.duration_ms = formatMsToHMS_1.default(item.duration_ms);
                });
                spotifyResponse = spotifyResponse.data;
            }
            catch (error) {
                console.log("SPOT here", error, (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data);
                spotifyResponse = error.response.data;
            }
        }
        console.log({ spotifyResponse });
        let youtubeResponse;
        // let youtubeVideoSearchResponse: any;
        if (sources.includes("YOUTUBE")) {
            //Youtube call
            try {
                youtubeResponse = yield youtube_1.default.get("/videos", {
                    params: {
                        part: "snippet,contentDetails",
                        chart: "mostPopular",
                        regionCode: region,
                    },
                });
            }
            catch (error) {
                console.log("here", (_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.data);
                youtubeResponse = error.response.data;
            }
            youtubeResponse.data.items.forEach((item) => {
                item.duration = formatYTDuration_1.default(item.contentDetails.duration);
            });
        }
        //If there is data, assign that value, else assign error
        const spotifyResults = ((_c = spotifyResponse === null || spotifyResponse === void 0 ? void 0 : spotifyResponse.data) === null || _c === void 0 ? void 0 : _c.tracks) || spotifyResponse;
        const youtubeResults = (youtubeResponse === null || youtubeResponse === void 0 ? void 0 : youtubeResponse.data) || youtubeResponse;
        // res.send(mockLandingPageResponse);
        // console.log({ spotifyResults, youtubeResults });
        res.send({ spotifyResults, youtubeResults });
    }));
    app.get("/api/search/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _d, _e, _f;
        //   //   // console.log("WOO", req.query.spotifyToken);
        const { spotifyToken, sources, } = req.query;
        let spotifyResponse;
        console.log({ sources });
        if (sources.includes("SPOTIFY")) {
            //Spotify call
            try {
                spotifyResponse = yield axios_1.default.get("https://api.spotify.com/v1/search", {
                    params: {
                        q: req.query.q,
                        type: "track",
                        limit: 30,
                    },
                    headers: {
                        Authorization: `Bearer ${spotifyToken}`,
                    },
                });
                // console.log(spotifyResponse.data.tracks.items);
                //Convert duration format
                spotifyResponse.data.tracks.items.forEach((item) => {
                    item.duration = formatMsToHMS_1.default(item.duration_ms);
                });
            }
            catch (error) {
                console.log("here", (_d = error === null || error === void 0 ? void 0 : error.response) === null || _d === void 0 ? void 0 : _d.data);
                spotifyResponse = error.response.data;
            }
        }
        //We need to make another search after these results if we want to get the video duration
        let youtubeResponse;
        let youtubeVideoSearchResponse;
        if (sources.includes("YOUTUBE")) {
            //Youtube call
            console.log({ QQQ: req.query.q });
            try {
                youtubeResponse = yield youtube_1.default.get("/search", {
                    params: { q: req.query.q, part: "snippet" },
                });
                const id = youtubeResponse.data.items
                    .map((item) => item.id.videoId)
                    .join();
                //Get duration for video
                youtubeVideoSearchResponse = yield youtube_1.default.get("/videos", {
                    params: { q: req.query.q, part: "contentDetails", id },
                });
            }
            catch (error) {
                console.log("here", (_e = error === null || error === void 0 ? void 0 : error.response) === null || _e === void 0 ? void 0 : _e.data);
                youtubeResponse = error.response.data;
            }
            youtubeResponse.data.items.map((item) => {
                const duration = youtubeVideoSearchResponse.data.items.find((videoItem) => videoItem.id === item.id.videoId).contentDetails.duration;
                console.log({
                    duration: youtubeVideoSearchResponse.data.items.find((videoItem) => videoItem.id === item.id.videoId),
                });
                item.duration = formatYTDuration_1.default(duration);
            });
        }
        //If there is data, assign that value, else assign error
        const spotifyResults = ((_f = spotifyResponse === null || spotifyResponse === void 0 ? void 0 : spotifyResponse.data) === null || _f === void 0 ? void 0 : _f.tracks) || spotifyResponse;
        const youtubeResults = (youtubeResponse === null || youtubeResponse === void 0 ? void 0 : youtubeResponse.data) || youtubeResponse;
        // console.log(spotifyResults, youtubeResults);
        res.send({ spotifyResults, youtubeResults });
        //   //MOCKS
        // res.send(mockResponse);
        //   // res.send({
        //   //   youtubeResults: youtubeJSONResponse,
        //   //   // spotifyResults: youtubeJSONResponse,
        //   // });
    }));
});
//# sourceMappingURL=search.js.map