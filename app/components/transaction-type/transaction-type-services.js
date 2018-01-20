angular.module('MyApp')
.factory('TransactionTypeServices', ['$http', '$q', function($http, $q) {
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
    getAllTransactionsType: function(params) {
      let actions = this.getTransactionTypeAction();
      let transactionsType = $http.get(`/get-all-transactions-type/page=${params.page}&pageSize=${params.pageSize}`) // TODO: use {cache: true}
          .then(function(response){
            _.forEach(response.data.transactionsType, function(data) {
              _.find(actions, function(action){
                if (data.transactionTypeAction == action.value) {
                  data.transactionTypeActionDescription = action.description;
                }
              });
            });
            return response.data;
          })
          .catch(function(response) {
            return $q.reject(response.data);
          });
      return transactionsType;
    },
    getActiveTransactionsType: function() {
      let transactionsType = $http.get(`/get-active-transactions-type`)
          .then(function(response){
            return response.data;
          }).catch(function(response) {
            return $q.reject(response.data);
          });
      return transactionsType;
    },
    getTransactionTypeById: function(id) {
      let transactionType = $http.get(`/transaction-type-id=${id}`)
          .then(function(response){
            return response.data;
          })
          .catch(function(response) {
            return $q.reject(response.data);
          });
      return transactionType;
    },
    save: function(newRecord, data) {
      let transactionType = {};
      if(newRecord) {
        transactionType = $http.post(`/transaction-type-new`, data)
          .then(function(response) {
            return response.data;
          }).catch(function(response) {
            return $q.reject(response.data);
          });
      } else {
        transactionType = $http.put(`/transaction-type-id=${data.id}`, data)
          .then(function(response) {
            return response.data;
          }).catch(function(response) {
            return $q.reject(response.data);
          });
      }
      return transactionType;
    }
  };
}]);
