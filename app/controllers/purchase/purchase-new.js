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
      top: {
        title: 'new purchase',
        url: '/purchase-new',
        show: false
      },
      required: 'All fields are required',
      noBalance: '',
      notFound: {
        message:'No record found!',
        bank: {
          url: '/bank-new',
          title: 'Add bank',
        },
        expense: {
          url: '/expense-type-new',
          title: 'Add expense',
        }
      },
      messages: {}
    };

    DefaultServices.setTop(data.top);
    getAllExpenses();
    getAllBanks();

    $scope.savePurchase = function($valid) {
      let purchase = null;
      let checKBalance = null;
      data.messages = {};

      if (data.isSaving) {
        return;
      }
      if (!$valid) {
        data.messages = {
          error: [{
            msg: data.required
          }]
        };
        return;
      }

      checKBalance = _.find(data.banks, function(bank) {
        return bank.id == data.purchase.purchaseBank;
      });

      if (parseFloat(data.purchase.purchaseAmount) > parseFloat(checKBalance.bankCurrentBalance)) {
        data.noBalance = `Amount $${data.purchase.purchaseAmount} is higher than available($${checKBalance.bankCurrentBalance})
                          in your account, please check!`;
        data.messages = {
          error: [{
            msg: data.noBalance
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
        getAllBanks();
        data.purchase = {};
      }).catch(function(response) {
        console.warn('Error updating purchase: ', response);
        data.isSaving = false;
        data.messages = {
          error: Array.isArray(response.data) ? response.data : [response.data]
        };
      });
    };

    function getAllExpenses() {
      let expenses = ExpenseTypeServices.getAllExpensesType(data.isActive);
      expenses.then(function(response) {
        if (!response || response.length == 0) {
          data.isLoading = false;
          return;
        }
        data.expenses = response;
        data.isLoading = false;
      }).catch(function(err) {
        console.warn('Error getting expenses: ', err);
      });
    };

    function getAllBanks() {
      let banks = BankServices.getAllBanks(data.isActive);
      banks.then(function(response) {
        if (!response || response.length == 0) {
          data.isLoading = false;
          return;
        }
        data.banks = response;
        data.isLoading = false;
      }).catch(function(err) {
        console.warn('Error getting banks: ', err);
      });
    };

    $scope.$watch('data.banks', function() {}, true);
    $scope.data = data;
  }]);
