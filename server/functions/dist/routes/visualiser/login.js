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
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
//Get data for user (using user id) from firestore which client will retrieve from cookies set by spotify auth
exports.default = (app) => __awaiter(void 0, void 0, void 0, function* () {
    app.get("/login/:user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        //may need to send additional info via payload
        const docRef = db.collection("users").doc(req.params.user);
        const doc = yield docRef.get();
        if (!doc.exists) {
            //Create new user
            const newUser = yield db
                .collection("users")
                .doc(req.params.user)
                .set({ data: "YAAY" });
            res.send(null);
            console.log("No such document!", { newUser });
        }
        else {
            //retrieve all user data
            console.log("Document data:", doc.data());
            res.send(doc.data());
        }
    }));
});
//# sourceMappingURL=login.js.map