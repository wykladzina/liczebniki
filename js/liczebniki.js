function playSound(fileName) {
  var deferred = jQuery.Deferred();
  var sound = new Audio(fileName);
  $(sound).bind('ended', function () {
    deferred.resolve();
  });
  sound.play();
  return deferred.promise();
}

function delayPromise(promise, delay) {
  var deferred = jQuery.Deferred();
  promise.then(function (result) {
    setTimeout(function () {
      deferred.resolve(result);
    }, delay);
  });
  return deferred.promise();
}

function playSounds(sounds, delay) {
  var playFinishedPromise = playSound(sounds[0]);
  var i = 1;
  while (i < sounds.length) {
    (function () {
      var soundNumber = i;
      playFinishedPromise = delayPromise(playFinishedPromise, delay).then(function () {
        return playSound(sounds[soundNumber]);
      });
    })();
    ++i;
  }
}

function startMessages() {
  $message = 'Kliknij przycisk <i>start</i>. Potem słuchaj uważnie, jak komputer będzie mówił liczby, i wpisz je w okienko poniżej.';
  $('#message-top').html($message);
  $('#check').hide();
  $('#start').show();
}

function checkMessages() {
  $message = 'Wpisz liczby, które usłyszysz za chwilę. Potem kliknij przycisk <i>sprawdź</i>.';
  $('#message-top').html($message);
  $('#start').hide();
  $('#check').show();
}

// http://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

$(function () {
  var numbers = undefined;

  $('#start').click(function () {
    checkMessages();
    $('#numbers').val('');
    numbers = [];
    for (var i = 0; i < 3; i++) {
      var number = Math.floor(Math.random() * 11);
      numbers.push(number);
    }
    setTimeout(function () {
      playSounds(numbers.map(function (number) {
        return 'sound/se/' + number + '.ogx';
      }), 1000);
    }, 1000);
  });

  $('#check').click(function () {
    var userNumbers = $('#numbers').val().split(/\D+/).filter(function (item) {
      return isNumeric(item);
    }).map(function(item) {
      return +item;
    });
    // http://stackoverflow.com/questions/7837456/how-to-compare-arrays-in-javascript
    if (userNumbers.toString() == numbers.toString()) {
      $('#message-bottom').text('Dobrze!');
    } else {
      $('#message-bottom').text('Źle. To były liczby ' + numbers);
    }
    startMessages();
  });

  startMessages();
});
