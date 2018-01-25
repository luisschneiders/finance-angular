angular.module('MyApp')
.factory('DefaultServices', ['$http', '$q', 'moment', function($http, $q, moment) {
  return {
    getSettings: function() {
      let settings = $http.get(`/settings`, {cache: true})
          .then(function(response){
            return response.data;
          })
          .catch(function(response) {
            return $q.reject(response.data);
          });
      return settings;
    }
  }
}]);
