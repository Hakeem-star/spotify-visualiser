//route for getting and setting user playlists

export default (app) => {
  //Get all playlists
  app.get("/playlists", (req, res) => {});
  //Get one playlists
  app.get("/playlists/:title", (req, res) => {});
  //Create a playlist
  app.post("/playlists/:title", (req, res) => {});
  //Edit a playlist
  app.patch("/playlists/:title", (req, res) => {});
};
