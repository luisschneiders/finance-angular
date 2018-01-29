angular.module('MyApp')
.factory('TransactionServices', ['$http', '$q', function($http, $q) {
  return {
    getTransactionsByCustomSearch: function(params) {
      // TODO: use {cache: true/false}, add parameter: custom-search=yes/no
      let data = $http.get(`/transactions-by-custom-search/${params.from}&${params.to}&${params.transactions}`)
          .then(function(response) {
            let groupedBy = {};
            let type = 0;

            groupedBy = _.groupBy(response.data, function(type) {
              return type = type.transactionType;
            });

            groupedBy = _.forEach(groupedBy, function(group) {
              group.TotalAmountByTransactionType = _.sum(group, function(amount) {
                return amount.transactionAmount;
              });
              group.transactionTypeDescription = group[0].transactionTypeDescription;
            });

            return {groupedBy: groupedBy, data: response.data};
          }).catch(function(response) {
            return $q.reject(response.data);
          });
      return data;
    },
    save: function(data) {
      let transaction = {};
      transaction = $http.post(`/transactions/new`, data)
        .then(function(response) {
          return response.data;
        }).catch(function(response) {
          return $q.reject(response.data);
        });
      return transaction;
    }
  };
}]);
