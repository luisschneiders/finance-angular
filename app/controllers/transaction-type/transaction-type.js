angular.module('MyApp')
  .controller('TransactionTypeCtrl', ['$scope', '$auth', '$location', 'DefaultServices', 'TransactionTypeServices', function($scope, $auth, $location, DefaultServices, TransactionTypeServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }
    $scope.settings = {};
    $scope.data = [];

    DefaultServices.getSettings()
      .then(function(response) {
        $scope.settings = response;
        setTop(response);
        getTransactionType(response);
      }).catch(function(err) {
        console.warn('Error getting settings: ', err);
      });

    $scope.editTransactionType = function(id) {
      $location.path(`/transaction-type/${id}`);
    };

    function setTop(settings) {
      DefaultServices.setTop(settings.transactionType.defaults.top);
    };

    function getTransactionType(settings) {
      TransactionTypeServices.getAllTransactionsType(settings.transactionType.defaults.isActive)
        .then(function(response) {
          if(!response || response.length == 0) {
            $scope.settings.transactionType.defaults.isNull = true;
            $scope.settings.transactionType.defaults.isLoading = false;
            return;
          }

          $scope.data = response;
          $scope.settings.transactionType.defaults.isLoading = false;

        }).catch(function(err) {
          console.warn('Error getting transactions type: ', err);
        });
    };    
    // let data = {
    //   transactionsType: [],
    //   isNull: false,
    //   notFound: {
    //     url: '/all-transactions-type',
    //     title: 'transactions',
    //     message:'Record Not Found!',
    //   },
    //   class: {
    //     active: 'is-active',
    //     inactive: 'is-inactive'
    //   },
    //   top: {
    //     title: 'transaction type',
    //     url: '/transaction-type-new',
    //     show: true
    //   },
    //   isLoading: false,
    //   typeAction: [],
    //   isActive: 0
    // };
    // let transactionsType = TransactionTypeServices.getAllTransactionsType(data.isActive);

    // data.isLoading = true;

    // DefaultServices.setTop(data.top);
    // data.typeAction = TransactionTypeServices.getTransactionTypeAction();

    // transactionsType.then(function(response) {
    //   if(!response || response.length == 0) {
    //     data.isNull = true;
    //     data.isLoading = false;
    //     return;
    //   }
    //   data.transactionsType = response;
    //   data.isLoading = false;
    // }).catch(function(err) {
    //   console.warn('Error getting transactions type: ', err);
    // });

    // $scope.editTransactionType = function(id) {
    //   $location.path(`/transaction-type/${id}`);
    // };

    // $scope.data = data;
  }]);
