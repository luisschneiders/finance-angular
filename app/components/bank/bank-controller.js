angular.module('MyApp')
  .controller('BankCtrl', ['$scope', '$auth', '$location', '$filter', '$routeParams', 'BankServices', 'DefaultServices',
  function($scope, $auth, $location, $filter, $routeParams, BankServices, DefaultServices) {
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
        getBanks();
        $scope.state.isLoading = true;
        $scope.state.noSettings = false;
        $scope.settings = response;
        DefaultServices.setTop(response.bank.defaults.top);
      }).catch(function(error) {
        $scope.state.noSettings = true;
        $scope.state.messages = {
          error: Array.isArray(error) ? error : [error]
        };
      });

    $scope.editBank = function(id) {
      $location.path(`/bank=${id}`);
    };

    $scope.previousPage = function() {
      $location.path(`/all-banks/page=${$scope.pagination.page - 1}&pageSize=${$scope.pageSize}`);
    };

    $scope.nextPage = function() {
      $location.path(`/all-banks/page=${$scope.pagination.page + 1}&pageSize=${$scope.pageSize}`);
    };

    $scope.refreshList = function(pageSize) {
      $location.path(`/all-banks/page=${$scope.pagination.page}&pageSize=${pageSize}`);
    };

    function getBanks() {
      let params = {
        page: page,
        pageSize: pageSize
      };
      BankServices.getAllBanks(params)
        .then(function(response) {
          $scope.state.isNull = false;
          $scope.state.isLoading = false;
          $scope.data = response.data;
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
