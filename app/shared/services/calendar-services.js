angular.module('MyApp')
.factory('CalendarServices', ['TimesheetServices', 'TransactionServices',  function(TimesheetServices, TransactionServices) {
  return {
    getTimesheets: function(period) {
      return TimesheetServices.getAllTimesheetsByMonth(period)
              .then(function(response){
                return response;
              }).catch(function(error) {
                return error;
              });
    },
    getTransactions: function(period) {
      return TransactionServices.getAllTransactionsByMonth(period)
              .then(function(response){
                return response;
              }).catch(function(error) {
                return error;
              });
    }
  }
}]);
