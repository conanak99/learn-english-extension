function getRandomElement(array) {
    let randomIndex = Math.floor((Math.random() * array.length));
    return array[randomIndex];
}

function getQuiz() {
  const numberOfAnswer = 4;
  const answers = [];
  for (var i = 0; i < numberOfAnswer; i++) {
    answers.push(getRandomElement(words));
  }

  const question = getRandomElement(answers);

  return { question, answers };
}

async function fetchImageFromServer() {
  var headers  = new Headers({
    'x-api-key': 'qGugB8rM7728ZKbEH8Wxc6mDHic0ijq6iETMiZTh'
  });

  var k = await fetch(
    'https://78tdi7b2n7.execute-api.ap-southeast-1.amazonaws.com/prod/GetRandomGirl',
    { headers: headers });

  var m = await k.json();
  return m;
}

function getRewardImageInternal() {
  // If local storage don't have many image
  // fetchImageFromServer();

  // Else read from local storage and return
}

function loadInitialImages() {
  // Load inital image and put into local storage

  // Remeber to check for duplicated

  // Load score from storage sync
}

function saveScore(score) {

}

function getRewardImage(score) {
  // Get image from local storage
  // chrome.storage.local

  return 'https://s-media-cache-ak0.pinimg.com/736x/72/0e/71/720e717befbd2127ecd66d2fc0efe6d8.jpg';
}

function preloadImage(imgUrl) {
  let img = new Image();
  img.src = imgUrl;
}


let module = angular.module("app", ['ngRoute']);

module.controller('MainController', ['$scope', function($scope) {
  $scope.score = 0;
}]);

module.controller('IndexController', ['$scope', '$location', function($scope, $location) {
  $scope.quiz = getQuiz();

  console.log($scope.quiz);

  $scope.goToResult = (meaning) => {
    let result = 0;
    if (meaning === $scope.quiz.question.meaning) result = 1;
    $location.path(`/result/${result}`);
  }
}]);

module.controller('ResultController', ['$scope', '$routeParams', function($scope, $routeParams) {
  $scope.result = $routeParams.result === '1';

  if ($scope.result) {
    // Use another module to get image
    $scope.text = "Tiếp tục";
    $scope.resultUrl = getRewardImage(0);
    // Use another module to increase score
  } else {
    // Reset score to zero
    $scope.text = "Bắt đầu lại";
    let wrongImages = ['polla-1.jpg', 'polla-2.jpg', 'polla-3.jpg', 'polla-4.jpg', 'polla-5.jpg'];
    $scope.resultUrl = 'img/wrong/' + getRandomElement(wrongImages);
  }

}]);

module.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
   .when('/', {
    templateUrl: 'js/app/template/index.html',
    controller: 'IndexController',
  })
  .when('/result/:result', {
    templateUrl: 'js/app/template/result.html',
    controller: 'ResultController'
  });
}]);
