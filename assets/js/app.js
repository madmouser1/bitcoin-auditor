'use strict';

LazyLoad.js([
  '//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js',
  '//cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.0/angular.min.js',
  '//maxcdn.bootstrapcdn.com/bootstrap/3.3.0/js/bootstrap.min.js',
], function() {
  angular.module('bitcoinAuditorApp', []);

  angular.module('bitcoinAuditorApp').config(function($locationProvider) {
      $locationProvider.html5Mode({
          enabled: false,
          requireBase: false
      });
  });

  angular.module('bitcoinAuditorApp').controller('MainCtrl', function ($scope, $http, $window, $location) {
    var token = $window.localStorage.getItem('apiToken');
    $scope.token = token ? token : '';
    $scope.data = false;
    $scope.loading = false;
    $scope.hasToken = !!token;
    $scope.appLoaded = {display: 'initial'};
    $scope.demoMode = false;

    function refreshCallback(data) {
      $scope.data = data;
      $scope.reward = parseFloat($scope.data.unconfirmed_reward) + parseFloat($scope.data.confirmed_reward);
      $scope.thresholdPercent = $scope.reward / parseFloat($scope.data.send_threshold) * 100;

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
    }

    $scope.refresh = function() {
      $scope.hasToken = true;
      $scope.loading = true;

      $http.get('https://mining.bitcoin.cz/accounts/profile/json/' + $scope.token).then(function(data) {
        refreshCallback(data.data);
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

    function demoMode() {
      if ($location.absUrl().indexOf('demo') > -1) {
        var demoData = {
          'username': 'zeus',
          'unconfirmed_reward': '52.00020113',
          'rating': 'none',
          'nmc_send_threshold': '10.00000000',
          'unconfirmed_nmc_reward': '0.00000000',
          'estimated_reward': '67.01300180',
          'hashrate': '4531',
          'confirmed_nmc_reward': '0.00000000',
          'send_threshold': '500.00000000',
          'confirmed_reward': '325.00336802',
          'workers': {
            'zeus.hera': {
              'last_share': 1418437334,
              'score': '970.227112964',
              'alive': true,
              'shares': 32296,
              'hashrate': 1030
            },
            'zeus.ares': {
              'last_share': 1418437334,
              'score': '870.227112964',
              'alive': false,
              'shares': 0,
              'hashrate': 0
            },
            'zeus.apollo': {
              'last_share': 1418437334,
              'score': '770.227112964',
              'alive': true,
              'shares': 32296,
              'hashrate': 1201
            },
            'zeus.poseidon': {
              'last_share': 1418437334,
              'score': '670.227112964',
              'alive': true,
              'shares': 32296,
              'hashrate': 2300
            },
            'zeus.athena': {
              'last_share': 1418437334,
              'score': '670.227112964',
              'alive': false,
              'shares': 0,
              'hashrate': 0
            },
          },
          'wallet': '1K4vgFrh4rRRm9w53Azgf6E7f9ZbBjLMVa'
        };

        $scope.demoMode = true;
        $scope.hasToken = true;
        refreshCallback(angular.extend({}, demoData));
      }
      else {
        $scope.demoMode = false;
        $scope.hasToken = !!$scope.token;
        if ($scope.hasToken) {
          $scope.refresh();
        }
      }
    }

    $scope.$on('$locationChangeSuccess', demoMode);

    demoMode();
  });

  angular.module('bitcoinAuditorApp').filter('hash', function () {
    return function(input) {
      var unit = 'Mh/s';
      input = parseFloat(input);
      if (input > 1024) {
        unit = 'Gh/s';
        input = input / 1024;

        if (input > 1024) {
          unit = 'Th/s';
          input = input / 1024;

          if (input > 1024) {
            unit = 'Ph/s';
            input = input / 1024;
          }
        }
      }

      return input.toFixed(2) + ' ' + unit;
    };
  });
});

LazyLoad.css([
  '//maxcdn.bootstrapcdn.com/bootstrap/3.3.0/css/bootstrap.min.css',
  'assets/css/material-nofont.min.css?v=1.0',
  'assets/css/font-awesome-custom.min.css?v=1.0',
]);
