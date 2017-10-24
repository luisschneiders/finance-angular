angular.module('MyApp')
.factory('MainServices', function($http) {
  return {
    getDefaultsApp: function(data) {
      return $http.post('/', data);
    }
  };
});