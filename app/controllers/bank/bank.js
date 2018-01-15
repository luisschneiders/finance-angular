angular.module('MyApp')
  .controller('BankCtrl', ['$scope', '$auth', '$location', '$filter', '$anchorScroll', 'BankServices', 'DefaultServices', function($scope, $auth, $location, $filter, $anchorScroll, BankServices, DefaultServices) {
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
        getBanks(response);
      }).catch(function(err) {
        console.warn('Error getting settings: ', err)
      });

    $scope.editBank = function(id) {
      $location.path(`/bank/${id}`);
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

    $scope.scrollUp = function() {
      $anchorScroll();
    };

    function setTop(settings) {
      DefaultServices.setTop(settings.bank.defaults.top);
    };

    function getBanks(settings) {
      BankServices.getAllBanks(settings.bank.defaults.isActive)
        .then(function(response) {
          if(!response || response.length == 0) {
            $scope.settings.bank.defaults.isNull = true;
            $scope.settings.bank.defaults.isLoading = false;
            return;
          }

          $scope.settings.bank.defaults.isLoading = false;
          $scope.data = response;

        }).catch(function(err) {
          console.warn('Error getting banks: ', err);
        });
    };
  }]);
