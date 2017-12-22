angular.module('MyApp')
  .controller('TransactionNewCtrl', ['$scope', '$auth', '$location', '$timeout', 'TransactionTypeServices', 'DefaultServices', function($scope, $auth, $location, $timeout, TransactionTypeServices, DefaultServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }
    let data = {
      isSaving: false,
      isNull: false, // it's required for the transaction-type-edit.html
      isActive: 1,
      top: {
        title: 'new transaction',
        url: '/transaction-new',
        show: true
      },
      transactionType: null
    };
    let transactionType = null;

    DefaultServices.setTop(data.top);

    transactionType = TransactionTypeServices.getAllTransactionsType(data.isActive);
    transactionType.then(function(response){
      data.transactionType = response;
    }).catch(function(response) {
      console.warn('Error getting transaction type: ', response);
      data.messages = {
        error: Array.isArray(response.data) ? response.data : [response.data]
      };
    });

    $scope.saveTransactionType = function($valid) {
      let transactionTypeUpdated = transactionTypeUpdated || null;
      if (data.isSaving) {
        return;
      }
      if(!$valid) {
        return;
      }
      data.isSaving = true;
      transactionTypeUpdated = TransactionTypeServices.add(data.transactionType);
      transactionTypeUpdated.then(function(response) {
        data.isSaving = false;
        data.messages = {
          success: [response.data]
        };
        $timeout(function() {
          $location.path(`/transaction-type/${response.data.transactionType.id}`);
        }, 1000);
      }).catch(function(response) {
        console.warn('Error updating transaction type: ', response);
        data.isSaving = false;
        data.messages = {
          error: Array.isArray(response.data) ? response.data : [response.data]
        };
      });
    };

    $scope.data = data;
  }]);
