"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
exports.default = axios_1.default.create({
    baseURL: "https://www.googleapis.com/youtube/v3",
    params: {
        maxResults: 30,
        type: "video",
        videoCategoryId: "10",
        key: process.env.YOUTUBE_API_KEY,
    },
});
//# sourceMappingURL=index.js.map