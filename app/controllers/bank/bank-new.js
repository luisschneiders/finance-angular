angular.module('MyApp')
  .controller('BankNewCtrl', ['$scope', '$auth', '$location', '$timeout', 'BankServices', 'DefaultServices', function($scope, $auth, $location, $timeout, BankServices, DefaultServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }
    let data = {
      bank: {
        bankDescription: null,
        bankAccount: null,
        bankInitialBalance: 0.00,
        bankCurrentBalance: 0.00,
        bankIsActive: 1
      },
      isSaving: false,
      isNull: false, // it's required for the bank-edit.html
      top: {
        title: 'new bank',
        url: '/bank-new',
        show: true
      }
    };

    DefaultServices.setTop(data.top);

    $scope.saveBank = function($valid) {
      let bankUpdated;
      if (data.isSaving) {
        return;
      }
      if(!$valid) {
        return;
      }
      data.isSaving = true;
      bankUpdated = BankServices.add(data.bank);
      bankUpdated.then(function(response) {
        data.isSaving = false;
        data.messages = {
          success: [response.data]
        };
        $timeout(function() {
          $location.path(`/bank/${response.data.bank.id}`);
        }, 1000);
      }).catch(function(response) {
        console.warn('Error updating bank: ', response);
        data.isSaving = false;
        data.messages = {
          error: Array.isArray(response.data) ? response.data : [response.data]
        };
      });
    };

    $scope.data = data;
  }]);
