$(function(){

  // Handle click event on new image form
  $('#new-image').on('click', function(evnt) {
    evnt.preventDefault();
    fetchNewData();
  });

  // Handle click even on answer choice
  $('#display').on('click', ".choice", function(evnt) {
    evnt.preventDefault();
    var choice = $(this).html();
    checkAnswer(choice);
  })

});

// Handlebars template
var source = $("#template").html();
var template = Handlebars.compile(source);

// Displays new data in handlebars template
var displayData = function(data) {
  var html = template(data);
  $('#display').empty().append(html);
  shuffleList();
  hideImage();
};

// Hides the album art after 2 seconds
var hideImage = function() {
  setTimeout(function() {
    $('#image').hide();
  }, 2000);
};

// Query API for new data
var data;
var fetchNewData = function() {
  $.get('/new', function(res) {
    data = res;
    displayData(res);
  });
}

var checkAnswer = function(answer) {
  var chosenAnswer = answer.toLowerCase();
  var correctAnswer = data.artist.toLowerCase();
  if(chosenAnswer === correctAnswer) {
    correctAction();
  } else {
    incorrectAction();
  }
};

// Action for correct answer selection
var correctAction = function() {
  $('#display').empty().append("<h1>CORRECT</h1>");
  setTimeout(function() {
    fetchNewData();
  }, 1000);
};

// Action for incorrect answer selection
var incorrectAction = function() {
  $('#display').empty().append("<h1>NOPE!</h1>");
  setTimeout(function() {
    fetchNewData();
  }, 1000);
};

// Random order of choices
var shuffleList = function() {
  $('.choice-list').each(function(){
    var $ul = $(this);
    var $liArr = $ul.children('li');
    $liArr.sort(function(a,b){
      var temp = parseInt( Math.random()*10 );
      var isOddOrEven = temp % 2;
      var isPosOrNeg = temp > 5 ? 1 : -1;
      return( isOddOrEven*isPosOrNeg );
    })
    .appendTo($ul);            
  });
}