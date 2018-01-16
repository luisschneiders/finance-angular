angular.module('MyApp')
.factory('MainServices', ['$http', function($http) {
  return {
    getDefaultsApp: function(data) {

    },
    getTransactionsByYear: function(year) {
      return $http.get(`/main-by-year/${year}`);
    }
  };
}]);
