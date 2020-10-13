angular.module('MyApp')
  .filter('sumColumns', function() {
    return function(collection, key, condition, feature) {
      let total = 0;

      _.forEach(collection, function(item) {
          switch(feature) {
            case 'timesheet':
              if (item.timesheetStatus == condition ) {
                return total += item[key];
              }  
              break;
            case 'purchases':
            case 'trip':
              return total += item[key];
            default:
              return null;
          }
      });

      return total;
    };
  });
