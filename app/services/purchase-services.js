angular.module('MyApp')
.factory('PurchaseServices', ['$http', function($http) {
  return {
    getPurchasesByYearAndMonth: function(period) {
      let data = $http.get(`/purchases-by-year-and-month/${period.year}/${period.month}`)
          .then(function(response) {
            let groupedBy = {};

            groupedBy = _.groupBy(response.data, function(type) {
              return this.type = type.purchaseExpenseId;
            });

            groupedBy = _.forEach(groupedBy, function(group) {
              group.TotalAmountByExpenseType = _.sum(group, function(amount) {
                return amount.purchaseAmount;
              });
              group.expenseTypeDescription = group[0].expenseTypeDescription;
            });

            groupedBy = _.forEach(groupedBy, function(items){
              let removed = _.remove(items, function(arr) {
                return delete this.arr;
              })
              return removed;
            });

            return {groupedBy: groupedBy, data: response.data};
          })
          .catch(function(err) {
            return err;
          });
      return data;
    },
    getPurchasesByCustomSearch: function(customSearch) {
      let data = $http.get(`/purchases-by-custom-search/${customSearch.from}&${customSearch.to}&${customSearch.expenseType}`)
          .then(function(response) {
            let groupedBy = {};

            groupedBy = _.groupBy(response.data, function(type) {
              return this.type = type.purchaseExpenseId;
            });

            groupedBy = _.forEach(groupedBy, function(group) {
              group.TotalAmountByExpenseType = _.sum(group, function(amount) {
                return amount.purchaseAmount;
              });
              group.expenseTypeDescription = group[0].expenseTypeDescription;
            });

            groupedBy = _.forEach(groupedBy, function(items){
              let removed = _.remove(items, function(arr) {
                return delete this.arr;
              })
              return removed;
            });

            return {groupedBy: groupedBy, data: response.data};
          })
          .catch(function(err) {
            return err;
          });
      return data;
    }    
  };
}]);
