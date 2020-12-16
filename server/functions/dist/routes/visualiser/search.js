"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mockResponse = __importStar(require("./mockResponse.json"));
const mockLandingPageResponse = __importStar(require("./mockLandingPageResponse.json"));
exports.default = (app) => __awaiter(void 0, void 0, void 0, function* () {
    app.get("/search/popular", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // const {
        //   spotifyToken,
        //   sources,
        //   region = "US",
        // }: {
        //   spotifyToken: string | undefined;
        //   sources: (string | number | undefined)[];
        //   region: string;
        // } = req.query;
        // let spotifyResponse: any;
        // if (sources.includes("SPOTIFY")) {
        //   //Spotify call
        //   try {
        //     spotifyResponse = await axios.get(
        //       "https://api.spotify.com/v1/me/top/tracks",
        //       {
        //         params: {
        //           limit: 30,
        //         },
        //         headers: {
        //           Authorization: `Bearer ${spotifyToken}`,
        //         },
        //       }
        //     );
        //     //Convert duration format
        //     spotifyResponse.data.items.forEach((item) => {
        //       item.duration_ms = formatMsToHMS(item.duration_ms);
        //     });
        //     spotifyResponse = spotifyResponse.data;
        //   } catch (error) {
        //     console.log("SPOT here", error, error?.response?.data);
        //     spotifyResponse = error.response.data;
        //   }
        // }
        // let youtubeResponse: any;
        // // let youtubeVideoSearchResponse: any;
        // if (sources.includes("YOUTUBE")) {
        //   //Youtube call
        //   try {
        //     youtubeResponse = await youtube.get("/videos", {
        //       params: {
        //         part: "snippet,contentDetails",
        //         chart: "mostPopular",
        //         regionCode: region,
        //       },
        //     });
        //   } catch (error) {
        //     console.log("here", error?.response?.data);
        //     youtubeResponse = error.response.data;
        //   }
        //   youtubeResponse.data.items.forEach((item) => {
        //     item.duration = formatYTDuration(item.contentDetails.duration);
        //   });
        // }
        // //If there is data, assign that value, else assign error
        // const spotifyResults = spotifyResponse?.data?.tracks || spotifyResponse;
        // const youtubeResults = youtubeResponse?.data || youtubeResponse;
        res.send(mockLandingPageResponse);
        // console.log({ spotifyResults, youtubeResults });
        // res.send({ spotifyResults, youtubeResults });
    }));
    app.get("/search/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        //   //   // console.log("WOO", req.query.spotifyToken);
        //   //   const {
        //   //     spotifyToken,
        //   //     sources,
        //   //   }: {
        //   //     spotifyToken: string | undefined;
        //   //     sources: (string | number | undefined)[];
        //   //   } = req.query;
        //   //   let spotifyResponse: any;
        //   //   console.log({ sources });
        //   //   if (sources.includes("SPOTIFY")) {
        //   //     //Spotify call
        //   //     try {
        //   //       spotifyResponse = await axios.get("https://api.spotify.com/v1/search", {
        //   //         params: {
        //   //           q: req.query.q,
        //   //           type: "track",
        //   //           limit: 30,
        //   //         },
        //   //         headers: {
        //   //           Authorization: `Bearer ${spotifyToken}`,
        //   //         },
        //   //       });
        //   //       // console.log(spotifyResponse.data.tracks.items);
        //   //       //Convert duration format
        //   //       spotifyResponse.data.tracks.items.forEach((item) => {
        //   //         item.duration = formatMsToHMS(item.duration_ms);
        //   //       });
        //   //     } catch (error) {
        //   //       console.log("here", error?.response?.data);
        //   //       spotifyResponse = error.response.data;
        //   //     }
        //   //   }
        //   //   //We need to make another search after these results if we want to get the video duration
        //   //   let youtubeResponse: any;
        //   //   let youtubeVideoSearchResponse: any;
        //   //   if (sources.includes("YOUTUBE")) {
        //   //     //Youtube call
        //   //     console.log({ QQQ: req.query.q });
        //   //     try {
        //   //       youtubeResponse = await youtube.get("/search", {
        //   //         params: { q: req.query.q, part: "snippet" },
        //   //       });
        //   //       const id = youtubeResponse.data.items
        //   //         .map((item) => item.id.videoId)
        //   //         .join();
        //   //       //Get duration for video
        //   //       youtubeVideoSearchResponse = await youtube.get("/videos", {
        //   //         params: { q: req.query.q, part: "contentDetails", id },
        //   //       });
        //   //     } catch (error) {
        //   //       console.log("here", error?.response?.data);
        //   //       youtubeResponse = error.response.data;
        //   //     }
        //   //     youtubeResponse.data.items.map((item) => {
        //   //       const duration = youtubeVideoSearchResponse.data.items.find(
        //   //         (videoItem) => videoItem.id === item.id.videoId
        //   //       ).contentDetails.duration;
        //   //       console.log({
        //   //         duration: youtubeVideoSearchResponse.data.items.find(
        //   //           (videoItem) => videoItem.id === item.id.videoId
        //   //         ),
        //   //       });
        //   //       item.duration = formatYTDuration(duration);
        //   //     });
        //   //   }
        //   //   //If there is data, assign that value, else assign error
        //   //   const spotifyResults = spotifyResponse?.data?.tracks || spotifyResponse;
        //   //   const youtubeResults = youtubeResponse?.data || youtubeResponse;
        //   //   // console.log(spotifyResults, youtubeResults);
        //   //   res.send({ spotifyResults, youtubeResults });
        //   //MOCKS
        res.send(mockResponse);
        //   // res.send({
        //   //   youtubeResults: youtubeJSONResponse,
        //   //   // spotifyResults: youtubeJSONResponse,
        //   // });
    }));
});
//# sourceMappingURL=search.js.map