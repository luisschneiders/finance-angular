angular.module('MyApp')
.factory('ExpenseTypeServices', ['$http', '$q', function($http, $q) {
  return {
    getAllExpensesType: function(params) {
      let expensesType = $http.get(`/get-all-expenses-type/page=${params.page}&pageSize=${params.pageSize}`) // TODO: use {cache: true}
          .then(function(response){
            return response.data;
          }).catch(function(response) {
            return $q.reject(response.data);
          });
      return expensesType;
    },
    getActiveExpensesType: function() {
      let expensesType = $http.get(`/get-active-expenses-type`)
          .then(function(response){
            return response.data;
          }).catch(function(response) {
            return $q.reject(response.data);
          });
      return expensesType;
    },
    getExpenseTypeById: function(id) {
      let expenseType = $http.get(`/expense-type-id=${id}`)
          .then(function(response){
            return response.data;
          }).catch(function(response) {
            return $q.reject(response.data);
          });
      return expenseType;
    },
    save: function(newRecord, data) {
      let expenseType = {};
      if(newRecord) {
        expenseType = $http.post(`/expense-type-new`, data)
          .then(function(response) {
            return response.data;
          }).catch(function(response) {
            return $q.reject(response.data);
          });
      } else {
        expenseType = $http.put(`/expense-type-id=${data.id}`, data)
          .then(function(response) {
            return response.data;
          }).catch(function(response) {
            return $q.reject(response.data);
          });
      }
      return expenseType;
    }
  };
}]);
