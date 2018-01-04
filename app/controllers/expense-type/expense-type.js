angular.module('MyApp')
  .controller('ExpenseTypeCtrl', ['$scope', '$auth', '$location', '$filter', 'DefaultServices', 'ExpenseTypeServices', function($scope, $auth, $location, $filter, DefaultServices, ExpenseTypeServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    };

    $scope.settings = {};
    $scope.data = [];
    $scope.currentPage = 0;
    $scope.pageSize = 12; // TODO: Set Default value in json file

    DefaultServices.getSettings()
      .then(function(response) {
        $scope.settings = response;
        setTop(response);
        getExpenseType(response);
      }).catch(function(err) {
        console.warn('Error getting settings: ', err);
      });

    $scope.editExpenseType = function(id) {
      $location.path(`/expense-type/${id}`);
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
      DefaultServices.setTop(settings.expenseType.defaults.top);
    };

    function getExpenseType(settings) {
      ExpenseTypeServices.getAllExpensesType(settings.expenseType.defaults.isActive)
        .then(function(response) {
          if(!response || response.length == 0) {
            $scope.settings.expenseType.defaults.isNull = true;
            $scope.settings.expenseType.defaults.isLoading = false;
            return;
          }
          $scope.data = response;
          $scope.settings.expenseType.defaults.isLoading = false;

        }).catch(function(err) {
          console.warn('Error getting expenses type: ', err);
        });
    };
  }]);
