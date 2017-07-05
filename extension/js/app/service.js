function getRandomElement(array) {
  let randomIndex = Math.floor((Math.random() * array.length));
  return array[randomIndex];
}

module.factory('StorageService', function() {
  return {
    getScore() {
      return parseInt(localStorage.getItem('score') || 0);
    },
    setScore(score) {
      localStorage.setItem('score', score);
    },
    getImageStore() {
      var imageStore = localStorage.getItem('imageStore');
      if (!imageStore) return { normal: [], sexy: []};
      return JSON.parse(imageStore);
    },
    setImageStore(imageStore) {
      localStorage.setItem('imageStore', JSON.stringify(imageStore));
    }
  }
});

module.factory('QuizService', [
  'StorageService',
  function(StorageService) {
    return {
      score: StorageService.getScore(),
      increaseScore: function(number) {
        this.score += number;
        StorageService.setScore(this.score);
      },
      reset: function() {
        this.score = 0;
        StorageService.setScore(this.score);
      },
      getWord: function(word) {
        return words.filter(w => w.word === word)[0];
      },
      getQuiz: function() {
        const numberOfAnswer = 4;
        const answers = [];

        let i = 0;
        while (i < numberOfAnswer) {
          let randomAnswer = getRandomElement(words);
          if (answers.indexOf(randomAnswer) === -1
              && randomAnswer.word.length > 0
              && randomAnswer.meaning.length > 0) {
            answers.push(randomAnswer);
            i++
          }
        }

        const question = getRandomElement(answers);
        return {question, answers};
      }
    }
  }
]);

module.factory('ImageService', [
  'StorageService',
  function(StorageService) {
    function preloadImage(imgUrl) {
      let img = new Image();
      img.src = imgUrl;
    }

    return {
      imageStore: StorageService.getImageStore(),
      fetchImageFromAPI: async() => {
        var headers = new Headers({'x-api-key': 'qGugB8rM7728ZKbEH8Wxc6mDHic0ijq6iETMiZTh'});
        var fetchResult = await fetch('https://78tdi7b2n7.execute-api.ap-southeast-1.amazonaws.com/prod/GetRandomGirl', {headers: headers});
        return await fetchResult.json();
      },

      initializeStore: async function() {
        if (this.imageStore.normal.length === 0) {
          let imageStore = await this.fetchImageFromAPI();
          StorageService.setImageStore(imageStore);
          this.imageStore = imageStore;

          imageStore.normal.forEach(preloadImage);
          imageStore.sexy.forEach(preloadImage);
        } else {
          this.imageStore.normal.forEach(preloadImage);
          this.imageStore.sexy.forEach(preloadImage);
        }
      },

      loadMoreImageIntoStore: async function() {
        let newImages = await this.fetchImageFromAPI();

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

      getRewardImage: function(score) {
        var imageUrl = '';
        if (score % 4 === 0) {
          imageUrl = this.imageStore.sexy.shift();
        } else {
          imageUrl = this.imageStore.normal.shift();
        }
        StorageService.setImageStore(this.imageStore);

        // Fetch more if no image found
        if (this.imageStore.normal.length < 6) {
          this.loadMoreImageIntoStore();
        }
        return imageUrl;
      },
      getPunishImage: () => {
        let wrongImages = ['polla-1.jpg', 'polla-2.jpg', 'polla-3.jpg', 'polla-4.jpg', 'polla-5.jpg'];
        return '/img/wrong/' + getRandomElement(wrongImages);
      }
    };
  }
]);
