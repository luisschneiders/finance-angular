angular.module('MyApp')
.factory('PurchaseServices', ['$http', '$q', function($http, $q) {
  return {
    getPurchasesByCustomSearch: function(params) {
      // TODO: use {cache: true/false}, add parameter: custom-search=yes/no
      let data = $http.get(`/purchases-by-custom-search/${params.from}&${params.to}&${params.expenses}`)
          .then(function(response) {
            let groupedBy = {};
            let totalAmount = 0;

            groupedBy = _.groupBy(response.data, function(type) {
              return type = type.purchaseExpenseId;
            });

            groupedBy = _.forEach(groupedBy, function(group) {
              group.TotalAmountByExpenseType = _.sum(group, function(amount) {
                return amount.purchaseAmount;
              });
              group.expenseTypeDescription = group[0].expenseTypeDescription;
            });

            _.forEach(response.data, function(item) {
              return totalAmount += item.purchaseAmount;
            }, totalAmount);

            return {groupedBy, data: response.data, totalAmount};
          }).catch(function(response) {
            return $q.reject(response.data);
          });
      return data;
    },
    save: function(data) {
      let purchase = {};
      purchase = $http.post(`/purchases/new`, data)
        .then(function(response) {
          return response.data;
        }).catch(function(response) {
          return $q.reject(response.data);
        });
      return purchase;
    }
  };
}]);
