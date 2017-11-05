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
      let actions = this.getTransactionTypeAction();
      let transactionsType = $http.get('/transactions-type')
          .then(function(response){
            _.forEach(response.data, function(data) {
              _.find(actions, function(action){
                if (data.transactionTypeAction == action.value) {
                  data.transactionTypeActionDescription = action.description;
                }
              });
            });
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
