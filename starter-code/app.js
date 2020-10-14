require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

//Require spotify-web-api-node package
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

//Set up the spotify-api
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

//Routes
app.get("/", function (req, res) {
  res.render("index");
});

app.get("/artist-search", function (req, res) {
  spotifyApi
    .searchArtists(req.query.artistq) //artistq b/c this is the name assigned in the form in index.hbs
    .then((data) => {
      console.log(
        "The received data from the API: ",
        data.body.artists.items
        //path to images - data.body.artists.items[0].images[0].url
      );
      // AFTER RECEIVING THE DATA FROM THE API, render it as follows:
      res.render("artist-search-results", { artist: data.body.artists.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  // console.log(req.params.artistId, "test");
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(function (data) {
      // console.log(data.body.items);
      //res.send(data.body.items);
      res.render("albums", { album: data.body.items });
    })
    .catch(
      (err) => console.log("The error occurred while loading albums: ", err) //I'm getting an error but the albums are loading. Don't get it.
    );
});

app.get("/tracks/:albumIdhere", (req, res) => {
  spotifyApi
  .getAlbumTracks(req.params.albumIdhere)
  .then(function(data){
    res.render("tracks", {track: data.body.items}); 
  })
  .catch(
    (err) => console.log("The error occurred while loading albums: ", err)
  );
});


app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
