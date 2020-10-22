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
const youtube_1 = __importDefault(require("../youtube"));
exports.default = (app) => __awaiter(void 0, void 0, void 0, function* () {
    app.get("/search/:title", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const songs = yield axios_1.default
            .all([
            axios_1.default.get("https://api.spotify.com/v1/search", {
                params: {
                    q: req.params.title,
                    type: "track",
                    limit: 5,
                },
                headers: {
                    Authorization: `Bearer ${req.cookies.ACCESS_TOKEN}`,
                },
            }),
            youtube_1.default.get("/search", {
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
    }));
});
//# sourceMappingURL=search.js.map