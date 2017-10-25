angular.module('MyApp')
  .controller('BankNewCtrl', function($scope, $location, BankServices, DefaultServices) {
    let data = {
      bank: null,
      url: '/all-banks',
      title: 'banks',
      isSaving: false,
      isNull: false,
      top: {
        title: 'new bank',
        url: '/bank-new',
        show: true
      }      
    };
    // let id = $location.path().substr(6); // to remove /bank/
    // let banks = BankServices.getBankById(id);
    DefaultServices.setTop(data.top);

    $scope.data = data;

    // banks.then(function(response) {
    //   console.table(response);
    //   if (!response) {
    //     data.isNull = true;
    //     return;
    //   }
    //   data.isNull = false;
    //   data.bank = response;
    // }).catch(function(err) {
    //   console.warn('Error getting banks: ', err);
    // });
  });
