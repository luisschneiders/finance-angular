angular.module('MyApp')
.factory('DefaultServices', ['$http', '$q', function($http, $q) {
  return {
    getSettings: function() {
      let settings = $http.get(`/settings`, {cache: true})
          .then(function(response){
            return $q.resolve(response.data);
          })
          .catch(function(response) {
            return $q.reject(response.data);
          });
      return settings;
    }
  }
}]);
