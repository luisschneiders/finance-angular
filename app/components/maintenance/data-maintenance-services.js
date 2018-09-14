angular.module('MyApp')
.factory('DataMaintenanceServices', ['$http', '$q', function($http) {
  return {
    getTransactionsByMonth: function(period) {
      
      let data = $http.get(`/transactions-by-month/${period}`)
          .then(function(response) {
            return response.data;
          }).catch(function(response) {
            return $q.reject(response.data);
          });
      return data;
    },
  };
}]);
