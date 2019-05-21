require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require("node-spotify-api")
var axios = require("axios");
var fs = require("fs");
var spotify = new Spotify(keys.spotify);
var command = process.argv[2];
var rawQuery = process.argv.splice(3);
var query = rawQuery.join(" ");

switch(command) {
    case "movie-this":
        axios.get("http://www.omdbapi.com/?t=" + query + "&y=&plot=short&apikey=trilogy").then(
            function (response) {
                console.log(response.data);
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