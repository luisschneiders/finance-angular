angular.module('MyApp')
  .controller('ExpenseTypeNewCtrl', ['$scope', '$auth', '$location', '$timeout', 'ExpenseTypeServices', 'DefaultServices', function($scope, $auth, $location, $timeout, ExpenseTypeServices, DefaultServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }
    let data = {
      expenseType: {
        expenseTypeDescription: null,
        expenseTypeIsActive: 1
      },
      isSaving: false,
      isNull: false, // it's required for the expense-type-edit.html
      top: {
        title: 'new expense type',
        url: '/expense-type-new',
        show: true
      }
    };

    DefaultServices.setTop(data.top);

    $scope.updateExpenseType = function($valid) {
      let expenseTypeUpdated;
      if (data.isSaving) {
        return;
      }
      if(!$valid) {
        return;
      }
      data.isSaving = true;
      expenseTypeUpdated = ExpenseTypeServices.add(data.expenseType);
      expenseTypeUpdated.then(function(response) {
        data.isSaving = false;
        data.messages = {
          success: [response.data]
        };
        $timeout(function() {
          $location.path(`/expense-type/${response.data.expenseType.id}`);
        }, 1000);
      }).catch(function(response) {
        console.warn('Error updating expense: ', response);
        data.isSaving = false;
        data.messages = {
          error: Array.isArray(response.data) ? response.data : [response.data]
        };
      });
    };

    $scope.data = data;
  }]);
