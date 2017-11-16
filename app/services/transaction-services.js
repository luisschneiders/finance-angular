angular.module('MyApp')
.factory('TransactionServices', ['$http', function($http) {
  return {
    getTransactionsByYearAndMonth: function(period) {
      let data = $http.get(`/transactions-by-year-and-month/${period.year}/${period.month}`)
          .then(function(response) {
            let groupedBy = {};

            groupedBy = _.groupBy(response.data, function(type) {
              return this.type = type.transactionType;
            });

            groupedBy = _.forEach(groupedBy, function(group) {
              group.TotalAmountByTransactionType = _.sum(group, function(amount) {
                return amount.transactionAmount;
              });
              group.transactionTypeDescription = group[0].transactionTypeDescription;
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
