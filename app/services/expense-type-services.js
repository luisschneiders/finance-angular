angular.module('MyApp')
.factory('ExpenseTypeServices', ['$http', function($http) {
  return {
    getAllExpensesType: function(isActive) {
      let expensesType = $http.get(`/all-expenses-type/${isActive}`)
          .then(function(response){
            return response.data;
          })
          .catch(function(error) {
            return error;
          });
      return expensesType;
    },
    getExpenseTypeById: function(id) {
      let expenseType = $http.get(`/expenses-type/${id}`)
          .then(function(response){
            return response.data;
          })
          .catch(function(error) {
            return error;
          });
      return expenseType;
    },
    update: function(data) {
      return $http.put(`/expenses-type/${data.id}`, data);
    },
    add: function(data) {
      return $http.post(`/expenses-type/new`, data);
    }
  };
}]);
