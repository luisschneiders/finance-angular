angular.module('MyApp')
.factory('TransactionServices', ['$http', function($http) {
  return {
    getDefaultsApp: function(data) {

    },
    getTransactionsByYearAndMonth: function(period) {
      return $http.get(`/transactions-by-year-and-month/${period.year}/${period.month}`);
    }
  };
}]);
