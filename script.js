'use strict';

angular.module('heimdall', ['ui.router'])
.constant("ATN", {
  "API_URL": "https://mongoexoress.herokuapp.com"
})
.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/");
  $stateProvider
    .state('home', {
      url: "/",
      templateUrl: "list.html",
      controller: 'MainCtrl'
    })
    .state('404', {
      url: "/404",
      templateUrl: "404.html"
    })
    .state('new', {
      url: "/new",
      templateUrl: "new.html",
      controller: "NewQuestionCtrl"
    })
    .state('question', {
      url: "/:slug",
      templateUrl: "question.html",
      controller: "QuestionCtrl"
    });
})
.factory('Question', function($http, ATN) {
  return {
    getOne: function(slug) {
      return $http.get(ATN.API_URL + "/questions/" + slug);
    },
    getAll: function() {
      return $http.get(ATN.API_URL + "/questions");
    },
    addQuestion: function(newQuestion) {
      return $http.post(ATN.API_URL + "/questions", newQuestion);
    }
  }
})
.factory('Answer', function($http, ATN) {
  return {
    answers: [],
    getAll: function() {
      return this.answers;
    },
    addAnswer: function(newAnswer) {
      this.answers.push(newAnswer);
      // return $http.post(ATN.API_URL + "/questions", newQuestion);
    }
  }
})
.filter("dateInWords", function() {
  return function(input) {
    return moment(input).utc().fromNow();
  }
})
.controller('NewQuestionCtrl', function($scope, Question, $state){
  $scope.askQuestion = function() {
    Question.addQuestion($scope.question)
      .success(function(data) {
        $scope.question = {};
        $state.go("home");
      })
      .catch(function(err) {
        console.error(err);
      })
  };
})
.controller('QuestionCtrl', function($scope, Question, Answer, $state){
  $scope.slug = $state.params.slug;

  $scope.answers = Answer.getAll();

  Question.getOne($state.params.slug)
    .success(function(data) {
      $scope.question = data;
    }).catch(function(err) {
      console.error(err);
      $state.go("404");
    });

  $scope.addAnswer = function() {
    Answer.addAnswer($scope.answer);
    $scope.answer = {};
  };

})
.controller('MainCtrl', function($scope, Question){
  Question.getAll().success(function(data) {
    $scope.questions = data;
  }).catch(function(err) {
    console.error(err);
  });
});
