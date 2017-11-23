angular.module('MyApp')
  .filter('sumColumns', function() {
    return function(collection) {
      let total = 0;

      _.forEach(collection, function(item) {
        return total += item.TotalAmountByExpenseType;
      });

      return total;
    };
  });
