angular.module('MyApp')
.factory('CalendarServices', ['TimesheetServices',  function(TimesheetServices) {
  return {
    getTimesheets: function(period) {
      return TimesheetServices.getAllTimesheetsByMonth(period)
              .then(function(response){
                // console.log('Response is:', response);
                return response;
              }).catch(function(error) {
                return error;
              });
    }
  }
}]);
