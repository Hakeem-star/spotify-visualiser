"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function msToHMS(ms) {
    // 1- Convert to seconds:
    let seconds = ms / 1000;
    // 2- Extract hours:
    const hours = parseInt((seconds / 3600).toString()); // 3,600 seconds in 1 hour
    seconds = seconds % 3600; // seconds remaining after extracting hours
    // 3- Extract minutes:
    const minutes = parseInt((seconds / 60).toString()); // 60 seconds in 1 minute
    // 4- Keep only seconds not extracted to minutes:
    seconds = seconds % 60;
    alert(hours + ":" + minutes + ":" + seconds);
}
exports.default = msToHMS;
//# sourceMappingURL=formatSpotifyDuration.js.map