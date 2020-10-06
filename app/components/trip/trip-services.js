angular.module('MyApp')
.factory('TripServices', ['$http', '$q', function($http, $q) {
  return {
    getAllTripsByMonth: function(period) {
      let data = $http.get(`/get-all-trips-month/${period}`)
        .then(function(response) {
          return response.data;
        }).catch(function(response) {
          return $q.reject(response.data);
        });
      return data;
    },
    save: function(data) {
      let trip = {};
      trip = $http.post(`/trips/new`, data)
        .then(function(response) {
          return response.data;
        }).catch(function(response) {
          return $q.reject(response.data);
        });
      return trip;
    },
    removeTrip: function(data) {
      let trip = {};
      trip = $http.put(`/trips/remove-trip=${data.id}`, data)
        .then(function(response) {
          return response.data;
        }).catch(function(response) {
          return $q.reject(response.data);
        });
      return trip;
    }
  };
}]);
