angular.module('MyApp')
  .controller('PurchaseNewCtrl', ['$scope', '$auth', '$location', '$timeout', 'DefaultServices', 'BankServices', 'ExpenseTypeServices', 'PurchaseServices', 
    function($scope, $auth, $location, $timeout, DefaultServices, BankServices, ExpenseTypeServices, PurchaseServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }

    let state = {
      settings: {},
      noSettings: true,
      isLoadingExpensesType: true,
      isLoadingBanks: true,
      messages: {},
      noBalance: ''
    };
    let data = {
      banks: [],
      expensesType: [],
      purchase: {}
    };
    let isSaving = false;

    setControllerSettings();

    function setControllerSettings() {
      DefaultServices.getSettings()
        .then(function(response) {
          state.settings = response;
          state.noSettings = false;
          getActiveExpensesType();
          getActiveBanks();
          DefaultServices.setTop(response.purchases.newRecord.top);
        }).catch(function(error) {
          state.noSettings = true;
          state.messages = {
            error: Array.isArray(error) ? error : [error]
          };
        });
    };

    function getActiveExpensesType() {
      ExpenseTypeServices.getActiveExpensesType()
        .then(function(response) {
          data.expensesType = response;
          state.isLoadingExpensesType = false;
        }).catch(function(error) {
          state.isLoadingExpensesType = false;
          state.messages = {
            error: Array.isArray(error) ? error : [error]
          };
        });
    };

    function getActiveBanks() {
      BankServices.getActiveBanks()
        .then(function(response) {
          data.banks = response;
          state.isLoadingBanks = false;
        }).catch(function(error) {
          state.isLoadingBanks = false;
          state.messages = {
            error: Array.isArray(error) ? error : [error]
          };
        });
    };

    $scope.savePurchase = function($valid) {
      let checKBalance = null;
      state.messages = {};

      if (isSaving) {
        return;
      }
      if (!$valid) {
        state.messages = {
          error: [{
            msg: state.settings.purchases.defaults.message.required
          }]
        };
        return;
      }

      checKBalance = _.find(data.banks, function(bank) {
        return bank.id == data.purchase.purchaseBank;
      });

      if (parseFloat(data.purchase.purchaseAmount) > parseFloat(checKBalance.bankCurrentBalance)) {
        state.noBalance = `Amount $${data.purchase.purchaseAmount} is higher than available($${checKBalance.bankCurrentBalance})
                          in your account, please check!`;
        state.messages = {
          error: [{
            msg: state.noBalance
          }]
        };
        return;
      }
      isSaving = true;
      PurchaseServices.save(data.purchase)
        .then(function(response) {
          isSaving = false;
          state.messages = {
            success: [response]
          };
          getActiveBanks();
          data.purchase = {};
        }).catch(function(error) {
          isSaving = false;
          state.messages = {
            error: Array.isArray(error) ? error : [error]
          };
        });
    };
    $scope.state = state;
    $scope.data = data;
  }]);
