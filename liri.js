require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require("node-spotify-api")
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");
var spotify = new Spotify(keys.spotify);
var command = process.argv[2];
var rawQuery = process.argv.splice(3);
var query = rawQuery.join(" ");

switch (command) {
    case "movie-this":
        if (!query) {
            query = "Mr. Nobody"
        }

        axios.get("http://www.omdbapi.com/?t=" + query + "&y=&plot=short&apikey=trilogy").then(
            function (response) {
                var movie = response.data;
                var rtRating;
                var rateList = movie.Ratings
                rateList.forEach(function (rating) {
                    if (rating.Source === "Rotten Tomatoes") {
                        rtRating = rating.Value;
                    }
                });
                console.log(`
                Title: ${movie.Title}
                Year: ${movie.Year}
                IMDB Rating: ${movie.imdbRating}
                Rotten Tomatoes Rating: ${rtRating}
                Country: ${movie.Country}
                Language: ${movie.Language}
                Plot: ${movie.Plot}
                Actors: ${movie.Actors}
                `);
            }
        );
        break;

    case "concert-this":
        axios.get("https://rest.bandsintown.com/artists/" + query + "/events?app_id=codingbootcamp").then(
            function (response) {
                var events = response.data;
                events.forEach(function (gig) {
                    var gigInfo = `
                    Venue: ${gig.venue.name}
                    Location: ${gig.venue.city}, ${gig.venue.country}
                    Date: ${moment(gig.datetime).format('L')}
                    `
                    console.log(gigInfo)
                })
            }
        );
        break;

    case "spotify-this-song":
        spotify.search({
            type: "track",
            query: query
        }).then(function (response) {
            var results = response.tracks.items

            results.forEach(function (item) {
                var artists = item.artists;
                artistsData = [];
                artists.forEach(function (artist) {
                    artistsData = [artist.name];
                })
                console.log(`
                Artist(s): ${artistsData}
                Song: ${item.name}
                Album: ${item.album.name}
                Preview URL: ${item.preview_url ? item.preview_url : "preview not available"}
                `);
            });
        });

        break;

    case "do-what-it-says":
        fs.readFile("./random.txt", "utf8", function (err, data) {
            if (err) {
                return console.log(err);
            } else {
                query = data;
                spotify.search({
                    type: "track",
                    query: query
                }).then(function (response) {
                    var results = response.tracks.items
        
                    results.forEach(function (item) {
                        var artists = item.artists;
                        artistsData = [];
                        artists.forEach(function (artist) {
                            artistsData = [artist.name];
                        })
                        console.log(`
                        Artist(s): ${artistsData}
                        Song: ${item.name}
                        Album: ${item.album.name}
                        Preview URL: ${item.preview_url ? item.preview_url : "preview not available"}
                        `);
                    });
                });
            }
        });
        
        break;
    default:
        console.log(`
        LIRI Commands:
        concert-this "<artist/band name>"
        spotify-this-song "<song name>"
        movie-this "<movie name>"
        do-what-it-says`)
}



/* concert-this for bands in town
spotify-this-song for spotify api
movie-this for
do-what-it-says*/