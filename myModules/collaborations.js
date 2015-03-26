module.exports = function() {

  var list = [];
  var filter = function(artistName) {
    if(artistName) {
      var sub = "(AND)",
        name = artistName.toLowerCase(),
        wordList = name.split(" ");

      var updated = false
      for (var i = 0; i < wordList.length; i++) {
        var currentWord = wordList[i];

        // If there is a colon, use everything after the colon 
        // and then move onto next artist name
        if(endsWith(currentWord, ":")) {
          var slice = wordList.slice(i+1)
          var joinedSlice = slice.join(" ");
          list.push(joinedSlice);
          break
        }

        // Uses the switch below to determine if word matches 
        // any of the given collaboration keywords
        if(checkList(currentWord)) {
          wordList[i] = sub;
          updated = true;
        }

        // If a word ends in a comma, it is most likely in a list
        //  of artists, and should have "(AND)" splice in, and comma removed
        if(endsWith(currentWord, ",")) {
          wordList[i] = removeComma(wordList[i]);
          wordList.splice((i+1), 0, sub);
          updated = true;
        }
        // If the name has been updated, and the loop has reached the end of the word, 
        // push it into the collaborations list
        if(i === wordList.length-1) {
          for (var i = 0; i < wordList.length; i++) {
            if(wordList[i] === sub) {
              var nameSlice = wordList.slice(0, i);
              var updatedName = nameSlice.join(" ");
              return updatedName
            }
          };
          var updatedName = wordList.join(" ");
          return updatedName
        }
      };
    }
  };


  // Reusable function to determine if the final character 
  // of a word is a given character
  var endsWith = function(word, character) {
    var possibleMatch = word[word.length-1];
    if(possibleMatch === character) {
      return true
    } else {
      return false
    }
  };


  // Removes a comma from the end of a word
  var removeComma = function(word) {
    if(word[word.length-1] === ",") {
      var wordArray = word.split("");
      wordArray.pop();
      var newWord = wordArray.join("");
      return newWord
    }
  }


  // Checks if a word matches any of the following
  var checkList = function(word) {
    switch(word) {
      case "feat.":
        return true;
        break
      case "&":
        return true;
        break
      case "and":
        return true;
        break
      case "vs.":
        return true;
        break
      case "vs":
        return true;
        break
      case "with":
        return true;
        break
      default:
        return false;
    }
  };

  return {
    filter: filter,
    list: list
  }

}