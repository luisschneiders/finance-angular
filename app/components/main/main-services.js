angular.module('MyApp')
.factory('MainServices', ['$http', '$q', function($http, $q) {
  return {
    getDefaultsApp: function(data) {

    },
    getTransactionsByYear: function(year) {
      let data = $http.get(`/main-by-year/${year}`)
        .then(function(response) {
          return response.data;
        }).catch(function(response) {
          return $q.reject(response.data);
        });
      return data;
    }
  };
}]);
