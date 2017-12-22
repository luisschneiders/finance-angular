angular.module('MyApp')
  .controller('TransactionTypeEditCtrl', ['$scope', '$auth', '$location', 'TransactionTypeServices', 'DefaultServices', function($scope, $auth, $location, TransactionTypeServices, DefaultServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }
    let data = {
      transactionType: null,
      isSaving: false,
      isNull: false,
      notFound: {
        url: '/all-transactions-type',
        title: 'transactions type',
        message:'Record Not Found!',
      },
      top: {
        title: 'update transaction type',
        url: '/transaction-type-new',
        show: true
      },
      typeAction: [],
      messages: {}
    };
    let id = $location.path().substr(18); // to remove /transaction-type/
    let transactionType = TransactionTypeServices.getTransactionTypeById(id);

    DefaultServices.setTop(data.top);
    data.typeAction = TransactionTypeServices.getTransactionTypeAction();

    transactionType.then(function(response) {
      if (!response) {
        data.isNull = true;
        return;
      }
      data.isNull = false;
      data.transactionType = response;
    }).catch(function(err) {
      console.warn('Error getting Transaction Type: ', err);
    });

    $scope.saveTransactionType = function($valid) {
      let transactionTypeUpdated;
      if (data.isSaving) {
        return;
      }
      if(!$valid) {
        return;
      }
      data.isSaving = true;
      transactionTypeUpdated = TransactionTypeServices.update(data.transactionType);
      transactionTypeUpdated.then(function(response) {
        data.isSaving = false;
        data.messages = {
          success: [response.data]
        };
      }).catch(function(response) {
        console.warn('Error updating Transaction Type: ', response);
        data.isSaving = false;
        data.messages = {
          error: Array.isArray(response.data) ? response.data : [response.data]
        };
      });
    };

    $scope.data = data;
  }]);
