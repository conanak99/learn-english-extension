module.controller('MainController', [
  '$scope',
  'QuizService',
  'ImageService',
  function ($scope, QuizService, ImageService) {
    $scope.quizService = QuizService;

    $scope.isLoading = true;
    ImageService.initializeStore().then(() => {
      $scope.isLoading = false;
      $scope.$digest();
    })
  }
]);

module.controller('IndexController', [
  '$scope',
  '$location',
  '$anchorScroll',
  'QuizService',
  function ($scope, $location, $anchorScroll, QuizService) {
    $scope.quiz = QuizService.getQuiz();
    $anchorScroll('top');

    $scope.goToResult = (meaning) => {
      let result = 0;
      if (meaning === $scope.quiz.question.meaning)
        result = 1;
      $location.path(`/result/${result}/${$scope.quiz.question.word}`);
    }

    $scope.pronounce = (word) => {
      chrome.tts.speak(word, {
        'lang': 'en-US'
      })
    }
  }
]);

const winSfx = new Audio(chrome.runtime.getURL('audio/win.mp3'))
winSfx.volume = 0.5
const loseSfx = new Audio(chrome.runtime.getURL('audio/lose.mp3'))
loseSfx.volume = 0.5

module.controller('ResultController', [
  '$scope',
  '$location',
  '$routeParams',
  '$anchorScroll',
  'QuizService',
  'ImageService',
  function ($scope, $location, $routeParams, $anchorScroll, QuizService, ImageService) {

    $scope.linkClick = () => {
      $location.path(`/`);
    }

    $anchorScroll('top');
    $scope.result = $routeParams.result === '1';
    $scope.word = QuizService.getWord($routeParams.word);

    if ($scope.result) {
      $scope.text = "Tiếp tục";
      $scope.resultUrl = ImageService.getRewardImage(QuizService.score);
      winSfx.play()

      QuizService.increaseScore(1);
    } else {
      $scope.text = "Bắt đầu lại";
      $scope.resultUrl = ImageService.getPunishImage();
      loseSfx.play();

      QuizService.reset();
    }
  }
]);