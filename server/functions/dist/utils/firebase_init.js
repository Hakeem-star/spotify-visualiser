"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fbAuth = exports.fbStore = void 0;
const firebase_1 = __importDefault(require("firebase"));
require("firebase/auth");
require("firebase/firestore");
const firebaseConfig = {
    apiKey: "AIzaSyCbyA-7bgkqp-Oyyf8BZfjkN5nfqPY1V_A",
    authDomain: "spotify-visualiser-293211.firebaseapp.com",
    databaseURL: "https://spotify-visualiser-293211.firebaseio.com",
    projectId: "spotify-visualiser-293211",
    storageBucket: "spotify-visualiser-293211.appspot.com",
    messagingSenderId: "947650550606",
    appId: "1:947650550606:web:14afebc53c5379d4d75c1f",
};
firebase_1.default.initializeApp(firebaseConfig);
exports.fbStore = firebase_1.default.firestore();
exports.fbAuth = firebase_1.default.auth();
//# sourceMappingURL=firebase_init.js.map