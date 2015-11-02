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
  return playFinishedPromise;
}

function playNumbers(numbers, delay) {
  return playSounds(numbers.map(function (number) {
    return 'sound/se/' + number + '.ogx';
  }), delay);
}

function repeat(promiseFactory, howManyTimes) {
  var promise = promiseFactory();
  var firstPromise = promise;
  for (var i = 1; i < howManyTimes; i++) {
    promise = promise.then(promiseFactory);
  }
  return firstPromise;
}

function startMessages() {
  $message = 'Kliknij przycisk <i>start</i>. Potem słuchaj uważnie, jak komputer będzie mówił liczby, i wpisz je w okienko poniżej.';
  $('#message-top').html($message);
  $('#message-bottom').html('');
  $('#numbers').val('');
  $('#start').show();
  $('#repeat').hide();
  $('#check').hide();
  $('#again').hide();
}

function checkMessages() {
  $message = 'Wpisz w okienko liczby, które usłyszysz za chwilę.';
  $('#message-top').html($message);
  $('#start').hide();
  $('#repeat').hide();
  $('#check').hide();
  $('#again').hide();
}

function repeatMessages() {
  $message = 'Jeśli chcesz usłyszeć te liczby jeszcze raz, kliknij przycisk <i>powtórz</i>. Jeśli nie, kliknij przycisk <i>sprawdź</i>';
  $('#message-top').html($message);
  $('#start').hide();
  $('#repeat').show();
  $('#check').show();
  $('#again').hide();
}

function resultMessages() {
  $message = 'Jeśli chcesz zagrać jeszcze raz, kliknij przycisk <i>jeszcze raz</i>';
  $('#message-top').html($message);
  $('#start').hide();
  $('#repeat').hide();
  $('#check').hide();
  $('#again').show();
}

// http://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function choose(array) {
  return array[Math.floor(Math.random() * array.length)]
}

var availableNumbers = [0,10,11,12,13,14,15,16,17,18,19,1,20,21,22,23,2,35,38,3,41,49,4,50,56,5,64,67,6,73,79,7,88,89,8,92,97,9];

$(function () {
  var numbers = undefined;

  $('#start').click(function () {
    checkMessages();
    numbers = [];
    for (var i = 0; i < 3; i++) {
      var number = choose(availableNumbers);
      numbers.push(number);
    }
    playNumbers(numbers, 500).then(function () {
      repeatMessages();
    });
  });

  $('#repeat').click(function () {
    checkMessages();
    playNumbers(numbers, 500).then(function () {
      repeatMessages();
    });
  });

  $('#again').click(function () {
    startMessages();
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
    resultMessages();
  });

  startMessages();
});
