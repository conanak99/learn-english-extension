module.factory('StorageService', function () {
  return {
    getScore() {
      return parseInt(localStorage.getItem('score') || 0);
    },
    setScore(score) {
      localStorage.setItem('score', score);
    },
    getImageStore() {
      var imageStore = localStorage.getItem('imageStore');
      if (!imageStore) return {
        normal: [],
        sexy: []
      };
      return JSON.parse(imageStore);
    },
    setImageStore(imageStore) {
      localStorage.setItem('imageStore', JSON.stringify(imageStore));
    }
  }
});

module.factory('QuizService', [
  'StorageService',
  function (StorageService) {
    return {
      score: StorageService.getScore(),
      increaseScore: function (number) {
        this.score += number;
        StorageService.setScore(this.score);
      },
      reset: function () {
        this.score = 0;
        StorageService.setScore(this.score);
      },
      getWord: function (word) {
        return words.filter(w => w.word === word)[0];
      },
      getQuiz: function () {
        const numberOfAnswer = 4;
        const answers = [];

        let i = 0;
        while (i < numberOfAnswer) {
          let randomAnswer = getRandomElement(words);
          if (answers.every(answer => answer.word !== randomAnswer.word) &&
            randomAnswer.word && randomAnswer.meaning
          ) {
            answers.push(randomAnswer);
            i++
          }
        }

        const question = getRandomElement(answers);
        return {
          question,
          answers
        };
      }
    }
  }
]);

module.factory('ImageService', [
  'StorageService',
  function (StorageService) {
    function preloadImage(imgUrl) {
      let img = new Image();
      img.src = imgUrl;
    }

    return {
      imageStore: StorageService.getImageStore(),
      fetchImages: async () => {
        const normalUrl = chrome.runtime.getURL('data/normal.json');
        const sexyUrl = chrome.runtime.getURL('data/sexy.json');

        const normalImgs = await fetch(normalUrl).then((response) => response.json())
        const sexyImgs = await fetch(sexyUrl).then((response) => response.json())


        return {
          normal: getRandomElements(20, normalImgs),
          sexy: getRandomElements(10, sexyImgs)
        }
      },

      initializeStore: async function () {
        if (this.imageStore.normal.length === 0) {
          let imageStore = await this.fetchImages();
          StorageService.setImageStore(imageStore);
          this.imageStore = imageStore;

          imageStore.normal.forEach(preloadImage);
          imageStore.sexy.forEach(preloadImage);
        } else {
          this.imageStore.normal.forEach(preloadImage);
          this.imageStore.sexy.forEach(preloadImage);
        }
      },

      loadMoreImageIntoStore: async function () {
        let newImages = await this.fetchImages();

        newImages.normal.forEach(imageUrl => {
          if (this.imageStore.normal.indexOf(imageUrl) === -1) {
            this.imageStore.normal.push(imageUrl);
            preloadImage(imageUrl);
          }
        });

        newImages.sexy.forEach(imageUrl => {
          if (this.imageStore.sexy.indexOf(imageUrl) === -1) {
            this.imageStore.sexy.push(imageUrl);
            preloadImage(imageUrl);
          }
        });
        StorageService.setImageStore(this.imageStore);
      },

      getRewardImage: function (score) {
        var imageUrl = '';
        if (score % 3 === 0) {
          imageUrl = this.imageStore.sexy.shift();
        } else {
          imageUrl = this.imageStore.normal.shift();
        }
        StorageService.setImageStore(this.imageStore);

        // Fetch more if no image found
        if (this.imageStore.normal.length < 10) {
          this.loadMoreImageIntoStore();
        }
        return imageUrl;
      },

      getPunishImage: () => {
        let wrongImages = ['polla-1.jpg', 'polla-2.jpg', 'polla-3.jpg', 'polla-4.jpg', 'polla-5.jpg', 'bo-1.jpg', 'bo-2.jpg', 'bo-3.png', 'bo-4.jpg'];
        return '/img/wrong/' + getRandomElement(wrongImages);
      }
    };
  }
]);