angular.module('MyApp')
  .filter('sumColumns', function() {
    return function(collection, key, condition, feature) {
      let total = 0;

      _.forEach(collection, function(item) {
          if (feature == 'timesheet') {
            if (item.timesheetStatus == condition ) {
              return total += item[key];
            }
          } else if (feature == 'purchases') {
            return total += item[key];
          }
      });

      return total;
    };
  });
