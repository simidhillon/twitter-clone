$(document).ready(function() {
  var $body = $('body');

  var bird_image = '<img id="bird-pic" src="https://public-media.si-cdn.com/filer/ec/c8/ecc8812c-4ac2-4dac-ab0f-cf0de4a76286/twitter_logo_whiteonblue.jpg"></img>';

  function tweetFormat(tweetUser, tweetMessage, tweetCreatedAt, omitIndex) {
    var breakLine = '<br>';
    if (omitIndex) {
      omitIndex = '';
      breakLine = '';
    } else {
      omitIndex = index;
    }
    var tweet = ('@'
      + `<a class="username" href="#">${tweetUser}</a>`
      + ` ${bird_image} <br>` + omitIndex + breakLine
      + tweetMessage + '<br>'
      + `${moment(tweetCreatedAt).format('MMMM Do YYYY, h:mm:ss a')}`
      + `<br><em><span class='time-since-tweet' id="${index}"`
      + `time-stamp="${tweetCreatedAt}">${moment(tweetCreatedAt).fromNow()}`
      + `</span></em>`);
    return tweet;
  }

  $('#create-message').submit(function(event) {
    event.preventDefault();
    console.log("username:", $('#visitor').val());
    console.log("message:", $("#visitor_message").val());
    window.visitor = $("#visitor").val();
    var message = $("#visitor_message").val();
    writeTweet(message);
    $("#update-tweets-button").trigger("click");
  });

  $("#update-tweets-button").click(function() {
   var tweetArray = [];
    if(window.lastTweetIndex === -1) {
      $('#container').html('');
    } else if (window.lastTweetIndex === undefined) {
      $("#default-tweet").toggle();
    }
    window.index = streams.home.length - 1;
    window.newTweetIndex = window.lastTweetIndex || -1;
    window.lastTweetIndex = window.index;
    while(index > window.newTweetIndex) {
      console.log("index:", index);
      var tweet = streams.home[window.index];
      var $tweet = $('<div class="tweet-container"></div>');
      $tweet.html(tweetFormat(
        tweet.user, tweet.message, tweet.created_at.getTime()));
      tweetArray.push($tweet);

      $tweet.click(function() {
        var username = $(this).text().split(' ')[0].slice(1);
        $('#container').html('');
        window.lastTweetIndex = -1;
        var userTweetLength = streams.users[username].length;
        var i = 0;
        userTweets = streams.users[username];
        while(userTweetLength > i) {
          var userTweet = userTweets[i];
          var $userTweet = $('<div class="user-tweet"></div>');
          $userTweet.html(tweetFormat(
            userTweet.user, userTweet.message, userTweet.created_at.getTime(),
            true));
          $('#container').append($userTweet);
          i++;
        }
      });
      window.index -= 1;
    };
    $('#container').prepend(tweetArray);
  });
});

setInterval(function() {
  $('.time-since-tweet').each((index, elem) => {
    $(elem).text(moment(+$(elem).attr('time-stamp')).fromNow());
  });
}, 1500);
