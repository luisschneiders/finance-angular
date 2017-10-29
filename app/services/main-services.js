angular.module('MyApp')
.factory('MainServices', function($http) {
  return {
    getDefaultsApp: function(data) {
      // return $http.get('/transactions-by-year');
    },
    getTransactionsByYear: function(year) {
      return $http.get(`/transactions-by-year/${year}`);      
    }
  };
});