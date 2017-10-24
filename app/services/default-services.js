angular.module('MyApp')
.factory('DefaultServices', function($http) {
  return {
    getDefaultsApp: function(data) {
      return $http.post('/', data);
    }
  };
});