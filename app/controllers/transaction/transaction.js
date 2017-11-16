angular.module('MyApp')
  .controller('TransactionCtrl', ['$scope', '$auth', '$location', 'moment', 'TransactionServices', 'DefaultServices',
  function($scope, $auth, $location, moment, TransactionServices, DefaultServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }
    let data = {
      modal: {
        title: null,
        transactions: null,
      },
      transactions: [],
      template: {
        url: 'partials/modal/transaction.tpl.html'
      },
      transactionsByGroup: {},
      typeAction: [],
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

      if (value == 'd') {
        data.monthAndYear = moment(data.monthAndYear).subtract(1, 'months').format();
      } else {
        data.monthAndYear = moment(data.monthAndYear).add(1, 'months').format();
      }

      data.period.year = moment(data.monthAndYear).format('YYYY');
      data.period.month = moment(data.monthAndYear).format('MM');
      $location.path(`/transactions/${data.period.year}/${data.period.month}`);
    };

    function getCurrentPeriodTransactions() {
      let transactions = null;
      DefaultServices.setMonthAndYear(data.currentPeriod);

      data.monthAndYear = DefaultServices.getMonthAndYear();
      data.period.year = moment(data.monthAndYear).format('YYYY');
      data.period.month = moment(data.monthAndYear).format('MM');

      transactions = TransactionServices.getTransactionsByYearAndMonth(data.period);
      transactions.then(function(response) {
        data.isNull = false;
        if (Object.keys(response.groupedBy).length === 0) {
          data.isNull = true;
        }

        data.transactions = response.data;
        data.transactionsByGroup = response.groupedBy;
        data.isLoading = false;
      }).catch(function(err) {
        console.warn('Error getting data: ', err);
      });
    };

    $scope.deleteTransaction = function(id) {
      console.log('Ill be in the services', id);
    };

    $scope.seeDetails = function(key, title) {
      data.modal.title = title.transactionTypeDescription;
      data.modal.transactions = _.filter(data.transactions, function(item) {
        if (item.transactionType == key) {
          return item;
        }
      });
    }

    $scope.data = data;
  }]);
