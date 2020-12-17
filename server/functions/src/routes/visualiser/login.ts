const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();
//Get data for user (using user id) from firestore which client will retrieve from cookies set by spotify auth

export default async (app) => {
  app.get("/api/login/:user", async (req, res) => {
    //may need to send additional info via payload

    const docRef = db.collection("users").doc(req.params.user);
    const doc = await docRef.get();

    if (!doc.exists) {
      //Create new user
      const newUser = await db
        .collection("users")
        .doc(req.params.user)
        .set({ data: "YAAY" });
      res.send(null);

      console.log("No such document!", { newUser });
    } else {
      //retrieve all user data
      console.log("Document data:", doc.data());
      res.send(doc.data());
    }
  });
};
