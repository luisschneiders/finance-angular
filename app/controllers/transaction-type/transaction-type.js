angular.module('MyApp')
  .controller('TransactionTypeCtrl', ['$scope', '$auth', '$location', '$filter', 'DefaultServices', 'TransactionTypeServices', function($scope, $auth, $location, $filter, DefaultServices, TransactionTypeServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }
    $scope.settings = {};
    $scope.data = [];
    $scope.currentPage = 0;
    $scope.pageSize = 12; // TODO: Set Default value in json file

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

    $scope.getData = function() {
      return $filter('filter')($scope.data);
    };

    $scope.numberOfPages = function() {
      return Math.ceil($scope.getData().length / $scope.pageSize);
    };

    $scope.refreshList = function(pageSize) {
      $scope.pageSize = pageSize;
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
  }]);
