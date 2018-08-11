angular.module('MyApp')
  .filter('sumColumns', function() {
    return function(collection, filterByKey) {
      let total = 0;

      _.forEach(collection, function(item) {
        return total += item[filterByKey];
      });

      return total;
    };
  });
