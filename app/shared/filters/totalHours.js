angular.module('MyApp')
  .filter('totalHours', function(TimeServices) {
    return function(timesheet) {
      let totalHours = TimeServices.getWorkedHours(timesheet);

      return totalHours;
    };
  });
