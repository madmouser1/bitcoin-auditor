'use strict';

angular.module('bitcoinAuditorApp', []);

angular.module('bitcoinAuditorApp').config(function($locationProvider) {
    $locationProvider.html5Mode({
        enabled: false,
        requireBase: false
    });
});
