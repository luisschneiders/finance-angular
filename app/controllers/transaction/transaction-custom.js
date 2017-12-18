angular.module('MyApp')
  .controller('TransactionCustomCtrl', ['$scope', '$auth', '$location', '$timeout', 'moment', 'TransactionServices', 'TransactionTypeServices', 'DefaultServices',
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
      isNull: false,
      isActive: 0,
      isLoading: true,
      notFound: {
        url: null,
        title: null,
        message:'No data found for the period!',
      },
      top: {
        title: 'transactions custom search',
        url: 'transaction-new',
        show: true
      },
      customSearch: {}
    };
    let customSearch = $location.path().substr(28); // to remove /custom-search-transactions/
    let transactionsType = TransactionTypeServices.getAllTransactionsType(data.isActive);
    let customTransaction = null;
    let refineSearch = customSearch.split('&');
    let search = {
      from: refineSearch[0],
      to: refineSearch[1],
      transactionType: refineSearch[2]
    };

    data.customSearch.active = 1;
    DefaultServices.setTop(data.top);
//  check if date are valid
    if (!moment(refineSearch[0]).isValid() || !moment(refineSearch[1]).isValid()) {
      data.isLoading = false;
      data.isNull = true;
      data.notFound.message = 'Dates are not valid';
      $scope.data = data;
      return;
    }

    customTransaction = TransactionServices.getTransactionsByCustomSearch(search);

    transactionsType.then(function(response) {
      data.transactionsType = response;
    }).catch(function(err) {
      console.warn('Error getting transactions type: ', err);
    });

    customTransaction.then(function(response){
      data.isNull = false;

      if (Object.keys(response.groupedBy).length === 0) {
        data.isNull = true;
      }

      data.transactions = response.data;
      data.transactionsByGroup = response.groupedBy;
      data.isLoading = false;
    }).catch(function(err) {
      console.warn('Error getting transactions type: ', err);
    });

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

    $scope.customSearch = function(key) {
      data.template.url = 'partials/modal/custom-search-transaction.tpl.html';
      data.template.class = 'modal-dialog';
      data.modal.title = 'Custom Search';
    };

    $scope.customSearchForm = function($valid) {
      // TODO: More validation to be added
      if(!$valid) {
        return;
      }
      if(data.customSearch.transactionsChecked || data.customSearch.transactionType == undefined) {
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
