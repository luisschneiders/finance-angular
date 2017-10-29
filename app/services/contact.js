angular.module('MyApp')
  .factory('Contact', ['$http', function($http) {
    return {
      send: function(data) {
        return $http.post('/contact', data);
      }
    };
  }]);
