require("dotenv").config();

var axios = require("axios");
var Spotify = require('node-spotify-api');
var fs = require("fs");
var spotifyKeys = require('./keys.js');
var spotify = new Spotify(spotifyKeys.spotify);
var request = require('request');
var moment = require('moment');

const [node, file, ...args] = process.argv;

if (process.argv[2] == 'concert-this' ) {
   
    var artist = process.argv.slice(3).join(" ")
    console.log(artist);
   
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    request(queryURL, function (error, response, body) {
        if (error) console.log(error);
        var result  =  JSON.parse(body)[0];
        console.log("Venue name " + result.venue.name);
        console.log("Venue location " + result.venue.city);
        console.log("Date of Event " +  moment(result.datetime).format("MM/DD/YYYY"));

    })};
    


if (args[0] === "movie-this") {
    if (args[1] === undefined) {
        movieInfo("Mr.+Nobody");
    }
    else {
        movieInfo(args.slice(1).join("+"));
    }
};

if (args[0] === "spotify-this-song") {

    if (args[1] === undefined) {
        spotifySong("The Sign");
    }
    else {
        var songTitle = args.slice(1).join(" ");
        spotifySong(songTitle);
    }
};

if (args[0] === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function (error, data) {

        if (error) {
            return console.log(error);
        }

        dataArr = data.split(",");
        if (dataArr[0] === "movie-this") {
            if (dataArr[1] === undefined) {
                movieInfo("Mr.+Nobody")
            }
            else {
                movieInfo(dataArr[1].split().join("+"))
            }
        };

        if (dataArr[0] === "spotify-this-song") {
            if (dataArr[1] === undefined) {
                spotifySong("The Sign")
            }
            else {
                spotifySong(dataArr[1])
            }
        };
    });
};

function spotifySong(songName) {

    spotify.search({ type: 'track', query: songName, limit: 1 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        
        data.tracks.items.forEach(function (element) {
            console.log("");
            
            console.log(`Artist: ${element.artists[0].name}`);
            console.log(`Song: ${element.name}`);
            console.log(`Spotify Preview Link: ${element.external_urls.spotify}`);
            console.log(`Album: ${element.album.name}`);
        });
    })
};

function movieInfo(movieName) {

    axios
        .get(`http://www.omdbapi.com/?t=${movieName}&apikey=cf1c54e0`)
        .then(function (movie) {

            console.log("");
            console.log(`Title: ${movie.data.Title}`);
            console.log(`Released: ${movie.data.Year}`);
            console.log(`IMDB Rating: ${movie.data.Ratings[0].Value}`);
            console.log(`Rotten Tomatoes Rating: ${movie.data.Ratings[1].Value}`);
            console.log(`Produced in: ${movie.data.Country}`);
            console.log(`Plot: ${movie.data.Plot}`);
            console.log(`Starring: ${movie.data.Actors}`);

        })
        .catch(function (err) {
            console.log(err);
        });
};
