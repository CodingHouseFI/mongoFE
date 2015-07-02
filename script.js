'use strict';

angular.module('heimdall', [])
.constant("ATN", {
  "API_URL": "http://localhost:3000"
})
.factory('Question', function($http, ATN) {
  return {
    getAll: function() {
      return $http.get(ATN.API_URL + "/questions");
    },

    addQuestion: function(newQuestion) {
      return $http.post(ATN.API_URL + "/questions", newQuestion);
    }
  }
})
.controller('MainCtrl', function($scope, Question){
  Question.getAll().success(function(data) {
    $scope.questions = data;
  }).catch(function(err) {
    console.error(err);
  });

  $scope.askQuestion = function() {
    Question.addQuestion($scope.question)
      .success(function(data) {
        $scope.questions.unshift(data);
        $scope.question = {};
        $("#new-question-modal").modal("hide");
      })
      .catch(function(err) {
        console.error(err);
      })
  };

});
