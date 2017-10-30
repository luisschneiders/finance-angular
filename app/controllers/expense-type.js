angular.module('MyApp')
  .controller('ExpenseTypeCtrl', ['$scope', '$auth', '$location', 'ExpenseTypeServices', 'DefaultServices', function($scope, $auth, $location, ExpenseTypeServices, DefaultServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }
    let data = {
      expensesType: [],
      isNull: false,
      notFound: {
        url: '/all-expenses-type',
        title: 'Expenses',
        message:'Record Not Found!',
      },
      class: {
        active: 'is-active',
        inactive: 'is-inactive'
      },
      top: {
        title: 'Expense Type',
        url: '/expense-type-new',
        show: true
      },
      isLoading: false
    };
    let expensesType = ExpenseTypeServices.getAllExpensesType();

    data.isLoading = true;

    DefaultServices.setTop(data.top);

    expensesType.then(function(response) {
      let top = {};
      console.log(response);
      if(!response || response.length == 0) {
        data.isNull = true;
        data.isLoading = false;
        return;
      }
      data.expensesType = response;
      top = DefaultServices.getTop();
      data.isLoading = false;
    }).catch(function(err) {
      console.warn('Error getting Expenses Type: ', err);
    });
    
    $scope.editExpenseType = function(id) {
      $location.path(`/expense-type/${id}`);
    };

    $scope.data = data;
  }]);
