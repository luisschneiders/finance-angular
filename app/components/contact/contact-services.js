angular.module('MyApp')
  .factory('ContactServices', ['$http', function($http) {
    return {
      send: function(data) {
        return $http.post('/contact', data);
      }
    };
  }]);
