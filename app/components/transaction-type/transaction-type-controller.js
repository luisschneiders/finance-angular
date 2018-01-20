angular.module('MyApp')
  .controller('TransactionTypeCtrl', ['$scope', '$auth', '$location', '$filter', '$routeParams', 'DefaultServices', 'TransactionTypeServices',
  function($scope, $auth, $location, $filter, $routeParams, DefaultServices, TransactionTypeServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }

    let page = $routeParams.page;
    let pageSize = $routeParams.pageSize;

    $scope.state = {};
    $scope.settings = {};
    $scope.data = [];
    $scope.currentPage = 0;
    $scope.pagination = {};
    $scope.pageSize = pageSize;
    $scope.state.noSettings = true;

    DefaultServices.getSettings()
      .then(function(response) {
        getTransactionsType();
        $scope.state.isLoading = true;
        $scope.state.noSettings = false;
        $scope.settings = response;
        DefaultServices.setTop(response.transactionType.defaults.top);
      }).catch(function(error) {
        $scope.state.noSettings = true;
        $scope.state.messages = {
          error: Array.isArray(error) ? error : [error]
        };
      });

    $scope.editTransactionType = function(id) {
      $location.path(`/transaction-type=${id}`);
    };

    $scope.previousPage = function() {
      $location.path(`/all-transactions-type/page=${$scope.pagination.page - 1}&pageSize=${$scope.pageSize}`);
    };

    $scope.nextPage = function() {
      $location.path(`/all-transactions-type/page=${$scope.pagination.page + 1}&pageSize=${$scope.pageSize}`);
    };

    $scope.refreshList = function(pageSize) {
      $location.path(`/all-transactions-type/page=${$scope.pagination.page}&pageSize=${pageSize}`);
    };

    function getTransactionsType(settings) {
      let params = {
        page: page,
        pageSize: pageSize
      };
      TransactionTypeServices.getAllTransactionsType(params)
        .then(function(response) {
          $scope.state.isNull = false;
          $scope.state.isLoading = false;
          $scope.data = response.transactionsType;
          $scope.pagination = response.pagination;
        }).catch(function(error) {
          $scope.state.isNull = true;
          $scope.state.isLoading = false;
          $scope.state.messages = {
            error: Array.isArray(error) ? error : [error]
          };
        });
    };    
  }]);
