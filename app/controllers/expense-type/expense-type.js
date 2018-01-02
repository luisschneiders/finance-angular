angular.module('MyApp')
  .controller('ExpenseTypeCtrl', ['$scope', '$auth', '$location', 'DefaultServices', 'ExpenseTypeServices', function($scope, $auth, $location, DefaultServices, ExpenseTypeServices) {
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
        getExpenseType(response);
      }).catch(function(err) {
        console.warn('Error getting settings: ', err);
      });

    $scope.editExpenseType = function(id) {
      $location.path(`/expense-type/${id}`);
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
