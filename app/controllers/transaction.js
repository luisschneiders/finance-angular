angular.module('MyApp')
  .controller('TransactionCtrl', ['$scope', '$auth', '$location', 'moment', 'TransactionServices', 'DefaultServices', function($scope, $auth, $location, moment, TransactionServices, DefaultServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }
    let data = {
      isNull: false,
      notFound: {
        url: null,
        title: null,
        message:'No data found for the period!',
      },
      top: {
        title: 'Transactions',
        url: 'transaction-new',
        show: true
      },
      isLoading: true,
      monthAndYear: null,
      currentPeriod: $location.path().substr(14), // to remove /transactions/
      period: {
        month: null,
        year: null
      }
    };

    DefaultServices.setTop(data.top);
    getCurrentPeriodTransactions();

    $scope.changePeriod = function(value) {
      data.monthAndYear = DefaultServices.getMonthAndYear();
      if(value == 'd') {
        data.monthAndYear = moment(data.monthAndYear).subtract(1, 'months').format();
      } else {
        data.monthAndYear = moment(data.monthAndYear).add(1, 'months').format();
      }
      data.period.year = parseInt(moment(data.monthAndYear).format('YYYY'));
      data.period.month = parseInt(moment(data.monthAndYear).format('MM'));
      $location.path(`/transactions/${data.period.year}/${data.period.month}`);
    };

    function getCurrentPeriodTransactions() {
      let transactions;
      DefaultServices.setMonthAndYear(data.currentPeriod);
      data.monthAndYear = DefaultServices.getMonthAndYear();
      data.period.year = parseInt(moment(data.monthAndYear).format('YYYY'));
      data.period.month = parseInt(moment(data.monthAndYear).format('MM'));
      transactions = TransactionServices.getTransactionsByYearAndMonth(data.period);
      transactions.then(function(response) {
        console.log('response');
        console.table(response.data);
        data.isNull = false;

        if(response.data.length == 0) {
          data.isNull = true;
        }


        data.isLoading = false;
      }).catch(function(err) {
        console.warn('Error getting data: ', err);
      });
    };

    $scope.data = data;
  }]);
