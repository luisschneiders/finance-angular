angular.module('MyApp')
.factory('TransactionServices', ['$http', function($http) {
  return {
    getTransactionsByYearAndMonth: function(period) {
      let data = $http.get(`/transactions-by-year-and-month/${period.year}/${period.month}`)
          .then(function(response) {
            let groups = {};
            let groupedBy = _.groupBy(response.data, function(type) {
              return this.type = type.transactionType;
            });
            groups = _.forEach(groupedBy, function(group) {
              group.TotalAmountByTransactionType = _.sum(group, function(amount) {
                return amount.transactionAmount;
              });
              group.transactionTypeDescription = group[0].transactionTypeDescription;
            });

            return groups;
          })
          .catch(function(err) {
            return err;
          });
      return data;
    }
  };
}]);
