angular.module('MyApp')
  .controller('BankCtrl', ['$scope', '$auth', '$location', '$filter', '$routeParams', 'BankServices', 'DefaultServices',
  function($scope, $auth, $location, $filter, $routeParams, BankServices, DefaultServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }

    let page = $routeParams.page;
    let pageSize = $routeParams.pageSize;

    $scope.settings = {};
    $scope.data = [];
    $scope.currentPage = 0;
    $scope.pagination = {};
    $scope.pageSize = pageSize;

    getSettings();
    getBanks();

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

    function getSettings() {
      DefaultServices.getSettings()
        .then(function(response) {
          $scope.settings = response;
          setTop(response);
        }).catch(function(err) {
          console.warn('Error getting settings: ', err)
        });
    };

    function setTop(settings) {
      DefaultServices.setTop(settings.bank.defaults.top);
    };

    function getBanks() {
      let params = {
        page: page,
        pageSize: pageSize
      };
      BankServices.getAllBanks(params)
        .then(function(response) {
          if(!response.data || response.data.length == 0) {
            $scope.settings.bank.defaults.isNull = true;
            $scope.settings.bank.defaults.isLoading = false;
            return;
          }
          $scope.settings.bank.defaults.isLoading = false;
          $scope.data = response.data;
          $scope.pagination = response.pagination;
        }).catch(function(err) {
          console.warn('Error getting banks: ', err);
        });
    };

  }]);
