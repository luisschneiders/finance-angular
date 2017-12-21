angular.module('MyApp')
  .controller('PurchaseNewCtrl', ['$scope', '$auth', '$location', '$timeout', 'DefaultServices', 'BankServices', 'ExpenseTypeServices', 'PurchaseServices', 
    function($scope, $auth, $location, $timeout, DefaultServices, BankServices, ExpenseTypeServices, PurchaseServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }
    let data = {
      banks: [],
      expenses: [],
      purchase: {},
      isSaving: false,
      isActive: 1,
      isNull: false,
      top: {
        title: 'new purchase',
        url: '/purchase-new',
        show: false
      },
      required: 'All fields are required'
    };
    let banks = BankServices.getAllBanks(data.isActive);
    let expenses = ExpenseTypeServices.getAllExpensesType(data.isActive);

    DefaultServices.setTop(data.top);

    banks.then(function(response) {
      if(!response || response.length == 0) {
        data.isNull = true;
        data.isLoading = false;
        return;
      }
      data.banks = response;
      data.isLoading = false;
    }).catch(function(err) {
      console.warn('Error getting banks: ', err);
    });

    expenses.then(function(response) {
      if(!response || response.length == 0) {
        data.isNull = true;
        data.isLoading = false;
        return;
      }
      data.expenses = response;
      data.isLoading = false;
    }).catch(function(err) {
      console.warn('Error getting expenses: ', err);
    });

    $scope.updatePurchase = function($valid) {
      let purchase = null;
      console.log('data.purchase', data.purchase);
      if (data.isSaving) {
        return;
      }
      if(!$valid) {
        data.messages = {
          error: [{
            msg: data.required
          }]
        };
        return;
      }
      data.isSaving = true;
      purchase = PurchaseServices.add(data.purchase);
      purchase.then(function(response) {
        data.isSaving = false;
        data.messages = {
          success: [response.data]
        };
      }).catch(function(response) {
        console.warn('Error updating purchase: ', response);
        data.isSaving = false;
        data.messages = {
          error: Array.isArray(response.data) ? response.data : [response.data]
        };
      });
    };

    $scope.data = data;
  }]);
