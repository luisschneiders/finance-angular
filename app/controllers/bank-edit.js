angular.module('MyApp')
  .controller('BankEditCtrl', function($scope, $location, BankServices, DefaultServices) {
    let data = {
      bank: null,
      url: '/all-banks',
      isSaving: false,
      isNull: false,
      notFound: 'Record Not Found!',
      class: {
        active: 'is-active',
        inactive: 'is-inactive'
      },
      top: {
        title: 'bank',
        url: '/bank-new',
        show: true
      }      
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
    $scope.data = data;
  });