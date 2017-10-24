angular.module('MyApp')
  .controller('BankCtrl', function($scope, $rootScope, $location, $window, $auth, BankServices) {
    let data = {
      banks: []
    };
    $scope.data = data;
    
    let banks = BankServices.getAllBanks();
    banks.then(function(response) {
      console.table(response);
      data.banks = response

    }).catch(function(err) {
      console.warn('Error getting banks: ', err);
    });

  });
