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
        if(!query){
            query = "Mr. Nobody"
        }


        axios.get("http://www.omdbapi.com/?t=" + query + "&y=&plot=short&apikey=trilogy").then(
            function (response) {
                var movie = response.data;
                var rtRating;
                var rateList = movie.Ratings
                rateList.forEach(function(rating){
                    if(rating.Source === "Rotten Tomatoes"){
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
                `)
            }
        );
        break;

    case "concert-this":
        axios.get("https://rest.bandsintown.com/artists/" + query + "/events?app_id=codingbootcamp").then(
            function (response){
                var events = response.data;
                events.forEach(function(gig){
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
    default:
        console.log(`
        LIRI Commands:
        concert-this "<artist/band name>"
        spotify-this-song "<song name>"
        movie-this "<movie name>"`)
}



/* concert-this for bands in town
spotify-this-song for spotify api
movie-this for
do-what-it-says*/