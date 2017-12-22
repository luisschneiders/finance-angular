angular.module('MyApp')
  .controller('BankEditCtrl', ['$scope', '$auth', '$location', 'BankServices', 'DefaultServices', function($scope, $auth, $location, BankServices, DefaultServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }
    let data = {
      bank: null,
      isSaving: false,
      isNull: false,
      notFound: {
        url: '/all-banks',
        title: 'banks',
        message:'Record Not Found!',
      },
      top: {
        title: 'update bank',
        url: '/bank-new',
        show: true
      },
      messages: {}
    };
    let id = $location.path().substr(6); // to remove /bank/
    let banks = BankServices.getBankById(id);

    DefaultServices.setTop(data.top);

    banks.then(function(response) {
      if (!response) {
        data.isNull = true;
        return;
      }
      data.isNull = false;
      data.bank = response;
    }).catch(function(err) {
      console.warn('Error getting banks: ', err);
    });

    $scope.saveBank = function($valid) {
      let bankUpdated;
      if (data.isSaving) {
        return;
      }
      if(!$valid) {
        return;
      }
      data.isSaving = true;
      bankUpdated = BankServices.update(data.bank);
      bankUpdated.then(function(response) {
        data.isSaving = false;
        data.messages = {
          success: [response.data]
        };
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
