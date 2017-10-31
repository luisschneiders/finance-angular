angular.module('MyApp')
.factory('TransactionTypeServices', ['$http', function($http) {
  return {
    getTransactionTypeAction: function() {
      return actions = [
        {
          value: null,
          description: 'Please select one...',
          selected: true
        },
        {
          value: 'C',
          description: 'Credit',
          selected: false
        },
        {
          value: 'D',
          description: 'Debit',
          selected: false
        },
        {
          value: 'T',
          description: 'Transfer',
          selected: false
        }
      ]
    },
    getAllTransactionsType: function() {
      let transactionsType = $http.get('/transactions-type')
          .then(function(response){
            return response.data;
          })
          .catch(function(error) {
            return error;
          });
      return transactionsType;
    },
    getTransactionTypeById: function(id) {
      let transactionType = $http.get(`/transactions-type/${id}`)
          .then(function(response){
            return response.data;
          })
          .catch(function(error) {
            return error;
          });
      return transactionType;
    },
    update: function(data) {
      return $http.put(`/transactions-type/${data.id}`, data);
    },
    add: function(data) {
      return $http.post(`/transactions-type/new`, data);
    }
  };
}]);
