// Modules
var Gracenote = require("node-gracenote");
var Collaborations = require("./collaborations");
var collaborations = new Collaborations();
process.env.NODE_ENV === "development" ? require('./apiKeys') : null;

// API variables
var clientId = process.env.clientId;
var clientTag = process.env.clientTag;
var userId = process.env.userId;

// Instantiate Gracenote wrapper connection
var gracenote = new Gracenote(clientId, clientTag, userId);


// Load artist list into memory
var fs = require('fs');
var readFile = function(filePath) {
  var dataString = fs.readFileSync(filePath, 'utf8')
  var data = dataString.split('\n');
  return data
}
var artistNames = readFile('meta_data.txt')

// Retrieve one random artist from meta data
var getRandomArtist = function(artistList) {
  var artistCount = artistList.length,
    selection = Math.floor(Math.random() * (artistCount + 1)),
    artist = artistList[selection],
    parsedArtist = collaborations.filter(artist);
  return parsedArtist
}

// Retrieve four random artists for wrong answers
var getFourRandomArtists = function(artistList) {
  var wrongAnswers = {};
  for (var i = 1; i < 5; i++) {
    var artist = getRandomArtist(artistList);
    var artistName = capitalize(artist);
    wrongAnswers["choice"+i] = artistName;
  };
  return wrongAnswers;
};

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
var capitalize = function(artist) {
  if(artist) {
    var artistNameArray = artist.split(" ");
    for(var i = 0; i < artistNameArray.length; i++) {
      artistNameArray[i] = artistNameArray[i].capitalize();
    };
    var artistName = artistNameArray.join(" ");
    return artistName
  }
};

// Search Gracenote API for answer data, and send to client via callback
var search = function(cb) {
  var wrongChoices = getFourRandomArtists(artistNames);
  var artist = getRandomArtist(artistNames);
  // Query the database, and repeat when response is not useful
  gracenote.searchArtist(artist, function(err, res) {
    if(err) {
      search(cb);
    } else if(res[0].album_artist_name === "Various Artists") {
      search(cb); 
    } else if(res[0].album_art_url) {
      var answer = {
        artist: res[0].album_artist_name,
        albumTitle: res[0].album_title,
        albumArt: res[0].album_art_url,
        wrongAnswers: wrongChoices
      };
      cb(answer);
    } else {
      search(cb);
    }
  }, Gracenote.BEST_MATCH_ONLY);
};

// Exposures
module.exports = {
  search: search
}