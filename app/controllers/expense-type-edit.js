angular.module('MyApp')
  .controller('ExpenseTypeEditCtrl', ['$scope', '$auth', '$location', 'ExpenseTypeServices', 'DefaultServices', function($scope, $auth, $location, ExpenseTypeServices, DefaultServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }
    let data = {
      expenseType: null,
      isSaving: false,
      isNull: false,
      notFound: {
        url: '/all-expenses-type',
        title: 'expenses type',
        message:'Record Not Found!',
      },
      top: {
        title: 'update expense type',
        url: '/expense-type-new',
        show: true
      },
      messages: {}
    };
    let id = $location.path().substr(14); // to remove /expense-type/
    let expenseType = ExpenseTypeServices.getExpenseTypeById(id);

    DefaultServices.setTop(data.top);

    expenseType.then(function(response) {
      if (!response) {
        data.isNull = true;
        return;
      }
      data.isNull = false;
      data.expenseType = response;
    }).catch(function(err) {
      console.warn('Error getting Expense Type: ', err);
    });

    $scope.updateExpenseType = function($valid) {
      let expenseTypeUpdated;
      if (data.isSaving) {
        return;
      }
      if(!$valid) {
        return;
      }
      data.isSaving = true;
      expenseTypeUpdated = ExpenseTypeServices.update(data.expenseType);
      expenseTypeUpdated.then(function(response) {
        data.isSaving = false;
        data.messages = {
          success: [response.data]
        };
      }).catch(function(response) {
        console.warn('Error updating Expense Type: ', response);
        data.isSaving = false;
        data.messages = {
          error: Array.isArray(response.data) ? response.data : [response.data]
        };
      });
    };

    $scope.data = data;
  }]);
