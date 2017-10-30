angular.module('MyApp')
  .controller('BankCtrl', ['$scope', '$auth', '$location', 'BankServices', 'DefaultServices', function($scope, $auth, $location, BankServices, DefaultServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }
    let data = {
      banks: [],
      class: {
        active: 'is-active',
        inactive: 'is-inactive'
      },
      isNull: false,
      notFound: {
        url: '/all-banks',
        title: 'banks',
        message:'Record Not Found!',
      },
      top: {
        title: 'banks',
        url: '/bank-new',
        show: true
      },
      isLoading: false
    };
    let banks = BankServices.getAllBanks();

    data.isLoading = true;

    DefaultServices.setTop(data.top);

    banks.then(function(response) {
      let top = {};
      if(!response || response.length == 0) {
        data.isNull = true;
        data.isLoading = false;
        return;
      }
      data.banks = response;
      top = DefaultServices.getTop();
      data.isLoading = false;
    }).catch(function(err) {
      console.warn('Error getting banks: ', err);
    });
    
    $scope.editBank = function(id) {
      $location.path(`/bank/${id}`);
    };

    $scope.data = data;
  }]);
