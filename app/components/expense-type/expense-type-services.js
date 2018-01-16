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
    save: function(newRecord, data) {
      if(newRecord) {
        return $http.post(`/expenses-type/new`, data);
      }
      return $http.put(`/expenses-type/${data.id}`, data);
    }
  };
}]);
