'use strict';

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
