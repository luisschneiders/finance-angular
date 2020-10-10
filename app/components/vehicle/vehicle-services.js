angular.module('MyApp')
.factory('VehicleServices', ['$http', '$q', function($http, $q) {
  return {
    getAllVehicles: function(params) {
      let vehicles = $http.get(`/get-all-vehicles/page=${params.page}&pageSize=${params.pageSize}`) // TODO: use {cache: true}
          .then(function(response){
            return response.data;
          }).catch(function(response) {
            return $q.reject(response.data);
          });
      return vehicles;
    },
    getActiveVehicles: function() {
      let vehicles = $http.get(`/get-active-vehicles`)
          .then(function(response){
            return response.data;
          }).catch(function(response) {
            return $q.reject(response.data);
          });
      return vehicles;
    },
    getVehicleById: function(id) {
      let vehicle = $http.get(`/vehicle-id=${id}`)
          .then(function(response){
            return response.data;
          }).catch(function(response) {
            return $q.reject(response.data);
          });
      return vehicle;
    },
    save: function(newRecord, data) {
      let vehicle = {};
      if(newRecord) {
        vehicle = $http.post(`/vehicle-new`, data)
          .then(function(response) {
            return response.data;
          }).catch(function(response) {
            return $q.reject(response.data);
          });
      } else {
        vehicle = $http.put(`/vehicle-id=${data.id}`, data)
          .then(function(response) {
            return response.data;
          }).catch(function(response) {
            return $q.reject(response.data);
          });
      }
      return vehicle;
    }
  };
}]);
