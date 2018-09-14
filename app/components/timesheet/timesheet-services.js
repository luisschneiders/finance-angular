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
    },
    save: function(data) {
      let timesheet = {};
      timesheet = $http.post(`/timesheets/new`, data)
        .then(function(response) {
          return response.data;
        }).catch(function(response) {
          return $q.reject(response.data);
        });
      return timesheet;
    },
    updateStatus: function(data) {
      let timesheet = {};
      timesheet = $http.put(`/timesheets/update-status=${data.id}`, data)
        .then(function(response) {
          return response.data;
        }).catch(function(response){
          return $q.reject(response.data);
        });
      return timesheet;
    },
    removeTimesheet: function(data) {
      let timesheet = {};
      timesheet = $http.put(`/timesheets/remove-timesheet=${data.id}`, data)
        .then(function(response) {
          return response.data;
        }).catch(function(response) {
          return $q.reject(response.data);
        });
      return timesheet;
    }
  };
}]);
