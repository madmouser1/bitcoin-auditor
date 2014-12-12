'use strict';

/**
 * @ngdoc function
 * @name bitcoinAuditorApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bitcoinAuditorApp
 */
angular.module('bitcoinAuditorApp').controller('MainCtrl', function ($scope, $http, $window) {
  var token = $window.localStorage.getItem('apiToken');
  $scope.token = token ? token : '';
  $scope.data = false;
  $scope.loading = false;
  $scope.hasToken = !!token;

  $scope.refresh = function() {
    //TODO: save api token to local storage
    $scope.hasToken = true;
    $scope.loading = true;

    $http.get('https://beta.mining.bitcoin.cz/accounts/profile/json/' + $scope.token).then(function(data) {
      $scope.data = data.data;
      $scope.reward = parseFloat($scope.data.unconfirmed_reward) + parseFloat($scope.data.confirmed_reward);
      $scope.thresholdPercent = parseFloat($scope.data.send_threshold) / $scope.reward;

      $scope.alive = 0;
      $scope.totalWorkers = 0;
      angular.forEach($scope.data.workers, function(worker, name) {
        $scope.totalWorkers++;
        worker.name = name.replace($scope.data.username + '.', '');
        worker.score = parseFloat(worker.score);

        if (worker.alive) {
          $scope.alive++;
        }
      });
    }, function(err) {
      console.log(err); //TODO error handling
    }).finally(function() {
      $scope.loading = false;
    });
  };

  $scope.saveApiToken = function() {
    $window.localStorage.setItem('apiToken', $scope.token);

    $scope.refresh();
  };

  if ($scope.hasToken) {
    $scope.refresh();
  }
});
