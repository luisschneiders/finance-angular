angular.module('MyApp')
  .controller('TransactionTypeCtrl', ['$scope', '$auth', '$location', 'TransactionTypeServices', 'DefaultServices', function($scope, $auth, $location, TransactionTypeServices, DefaultServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }
    let data = {
      transactionsType: [],
      isNull: false,
      notFound: {
        url: '/all-transactions-type',
        title: 'transactions',
        message:'Record Not Found!',
      },
      class: {
        active: 'is-active',
        inactive: 'is-inactive'
      },
      top: {
        title: 'transaction type',
        url: '/transaction-type-new',
        show: true
      },
      isLoading: false,
      typeAction: [],
      isActive: 0
    };
    let transactionsType = TransactionTypeServices.getAllTransactionsType(data.isActive);

    data.isLoading = true;

    DefaultServices.setTop(data.top);
    data.typeAction = TransactionTypeServices.getTransactionTypeAction();

    transactionsType.then(function(response) {
      if(!response || response.length == 0) {
        data.isNull = true;
        data.isLoading = false;
        return;
      }
      data.transactionsType = response;
      data.isLoading = false;
    }).catch(function(err) {
      console.warn('Error getting transactions type: ', err);
    });

    $scope.editTransactionType = function(id) {
      $location.path(`/transaction-type/${id}`);
    };

    $scope.data = data;
  }]);
