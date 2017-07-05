module.controller('MainController', [
  '$scope',
  'QuizService',
  'ImageService',
  function($scope, QuizService, ImageService) {
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
  function($scope, $location, $anchorScroll, QuizService) {
    $scope.quiz = QuizService.getQuiz();
    $anchorScroll('top');

    $scope.goToResult = (meaning) => {
      let result = 0;
      if (meaning === $scope.quiz.question.meaning)
        result = 1;
      $location.path(`/result/${result}/${$scope.quiz.question.word}`);
    }
  }
]);

module.controller('ResultController', [
  '$scope',
  '$location',
  '$routeParams',
  '$anchorScroll',
  'QuizService',
  'ImageService',
  function($scope, $location, $routeParams, $anchorScroll, QuizService, ImageService) {

    $scope.linkClick = () => {
      $location.path(`/`);
    }

    $anchorScroll('top');
    $scope.result = $routeParams.result === '1';
    $scope.word = QuizService.getWord($routeParams.word);

    if ($scope.result) {
      // Use another module to get image
      $scope.text = "Tiếp tục";
      QuizService.increaseScore(1);
      $scope.resultUrl = ImageService.getRewardImage(QuizService.score);
    } else {
      $scope.text = "Bắt đầu lại";
      QuizService.reset();
      $scope.resultUrl = ImageService.getPunishImage();
    }
  }
]);
