angular.module('MyApp')
.factory('TimesheetServices', ['$http', '$q', function($http, $q) {
  return {
    getAllTimesheetsByMonth: function(period) {
      let data = $http.get(`/get-all-timesheets-month/${period}`)
        .then(function(response) {
          return response.data;
        }).catch(function(response) {
          return $q.reject(response.data);
        });
      return data;
    }
  };
}]);
