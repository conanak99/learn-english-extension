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

    $scope.linkClick = () => {
      $location.path(`/`);
    }

    $scope.pronounce = (word) => {
      chrome.tts.speak(word, {
        'lang': 'en-US'
      })
    }

    const winTexts = ['Đúng rồi, giỏi quá ahihi! Em thưởng nè 💖',
      'Hihi anh iu cố lên 😘',
      'Đúng thêm vài câu nữa là cho thơm 1 cái nàaaaa 😘',
      'Trồi ôi từ này khó ghê mà anh cũng biết 😍',
      'Quỷ hà, ngồi học mà cứ lo ngắm người ta hok 😚',
      'Wow, anh giỏi tiếng Anh quá vậy 🥰',
      'Hmm, chữ này mà còn không biết là a giận luôn 🥺',
      'Cố lên anh ơi, học mệt nhớ uống nước nha 🥺',
      'Ahihi mấy tấm sau hở lắm đó, ngại quá hihi 😚',
      'Nói nhỏ cho nghe nè, em hâm mộ mấy anh giỏi TA lúm 💖'
    ]
    $scope.getWinText = () => {
      return getRandomElement(winTexts)
    }

    const loseTexts = ['Học bài lại đi, lêu lêu.....',
      'Trời, câu dễ vậy cũng không biết',
      'VN sắp thành cường quốc mà có mấy từ cũng không học được',
      'Cày nhiều vào anh ơi, học thế này là chết',
      'Cố lên, hồi xưa mình cũng sai miết hà',
      'Làm lại đi nè, còn nhiều hình gái chưa ngắm mà!',
    ]
    $scope.getLoseText = () => {
      return getRandomElement(loseTexts)
    }
  }
]);