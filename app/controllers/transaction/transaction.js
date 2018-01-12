// TODO: Code Refactoring
angular.module('MyApp')
  .controller('TransactionCtrl', ['$scope', '$auth', '$location', '$timeout', 'moment', 'TransactionServices', 'TransactionTypeServices', 'DefaultServices',
  function($scope, $auth, $location, $timeout, moment, TransactionServices, TransactionTypeServices, DefaultServices) {
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
      transactionsType: [],
      template: {
        url: null,
        class: null
      },
      transactionsByGroup: {},
      typeAction: [],
      isNull: false,
      isActive: 0,
      isLoading: true,
      notFound: {
        url: null,
        title: null,
        message:'No data found for the period!',
      },
      top: {
        pageTitle: 'Transactions',
        buttonTitle: 'Add',
        buttonUrl: 'transaction-new',
        buttonDisplay: true
      },
      monthAndYear: null,
      currentPeriod: $location.path().substr(14), // to remove /transactions/
      period: {
        month: null,
        year: null
      },
      customSearch: {}
    };
    let transactionsType = TransactionTypeServices.getAllTransactionsType(data.isActive);
    data.customSearch.active = 1;

    transactionsType.then(function(response) {
      data.transactionsType = response;
    }).catch(function(err) {
      console.warn('Error getting transactions type: ', err);
    });

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
      $location.path(`/transactions=${data.period.year}-${data.period.month}`);
    };

    $scope.deleteTransaction = function(id) {
      console.log('Ill be in the services', id);
    };

    $scope.seeDetails = function(key, title) {
      data.template.url = 'partials/modal/transaction.tpl.html';
      data.template.class = 'modal-dialog modal-lg';
      data.modal.title = title.transactionTypeDescription;
      data.modal.transactions = _.filter(data.transactions, function(item) {
        if (item.transactionType == key) {
          return item;
        }
      });
    }

    $scope.customSearch = function() {
      data.template.url = 'partials/modal/custom-search-transaction.tpl.html';
      data.template.class = 'modal-dialog';
      data.modal.title = 'Custom Search';
    };

    $scope.customSearchForm = function($valid) {
      // TODO: More validation to be added
      if(!$valid) {
        return;
      }
      if(data.customSearch.transactionType == undefined) {
        setTransactionType();
      }
      if(data.customSearch.checked) {
        data.customSearch.transactionType.push(0); // 0 = purchases        
      }
      $(".modal").modal("hide");
      $timeout(function() {
        $location.path(`/custom-search-transactions=${data.customSearch.from}&${data.customSearch.to}&${data.customSearch.transactionType.toString()}`);
      }, 500);
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

    function setTransactionType() {
      data.customSearch.transactionType = [];
      _.forEach(data.transactionsType, function(transaction) {
        if (transaction.transactionTypeIsActive === data.customSearch.active) {
          data.customSearch.transactionType.push(transaction.id);
        }
      });
    };

    $scope.data = data;
  }]);
