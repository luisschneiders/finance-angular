angular.module('MyApp')
  .filter('percentage', function() {
    return function(partialAmount, totalAmount) {
      let result = 0;
      let partialValue = parseFloat(partialAmount);
      let totalValue = parseFloat(totalAmount);
      result = (partialValue * 100) / totalValue;
      return result;
    };
  });