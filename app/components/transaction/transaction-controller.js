// TODO: Code Refactoring
angular.module('MyApp')
  .controller('TransactionCtrl', ['$scope', '$auth', '$location', '$timeout', '$routeParams', 'moment', 'DefaultServices', 'TransactionServices', 'TransactionTypeServices', 'BankServices',
  function($scope, $auth, $location, $timeout, $routeParams, moment, DefaultServices, TransactionServices, TransactionTypeServices, BankServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }
    class State {
      constructor(settings, params, status, messages, modal) {
        this.settings = settings;
        this.params = params;
        this.status = status;
        this.messages = messages;
        this.modal = modal;
      }
    };
    class Params {
      constructor($routeParams) {
        this.from = $routeParams.from;
        this.to = $routeParams.to;
        this.transactions = $routeParams.id;
      }
    };
    class Settings {
      constructor(defaults, component, newRecord, templateTop, modal) {
        this.defaults = defaults;
        this.component = component;
        this.newRecord = newRecord;
        this.templateTop = templateTop;
        this.modal = modal;
      }
    };
    class Status {
      constructor() {
        this.isNull = false;
        this.isLoading = true;
        this.isLoadingModal = true;
        this.isLoadingBanks = true;
        this.isLoadingTransactionsType = true;
        this.noSettings = true;
        this.isSaving = false;
        this.errorAdd = false;
        this.errorSearch = false;
        this.errorVIew = false;
        this.isValidForm = false;
        this.showConfirmDelete = false;
      }

      noBalance(amountInformed, amountAvailable ) {
        return `Amount $${amountInformed} is higher than available($${amountAvailable})
        in this account, please check!`
      };
    };
    class Modal {
      constructor(title, cssClass, url){
        this.title = title;
        this.cssClass = cssClass;
        this.url = url;
      }
    };
    class Data {
      constructor(transactions, transactionsByGroup, transactionsDetails, transactionsType, banks, form, typeAction, customSearch) {
        this.transactions = transactions;
        this.transactionsByGroup = transactionsByGroup;
        this.transactionsDetails = transactionsDetails;
        this.transactionsType = transactionsType;
        this.banks = banks;
        this.form = form;
        this.typeAction = typeAction;
        this.customSearch = customSearch;
      }
    };

    let settings = new Settings();
    let modal = new Modal();
    let params = new Params($routeParams);
    let status = new Status();
    let state = new State({}, params, status, {}, {});
    let data = new Data([],{},[],[],[],{}, [], {});

    DefaultServices.getSettings()
      .then(function(response) {
        status.noSettings = false;
        status.errorView = false;
        settings.defaults = response.defaults;
        settings.component = response.transactions;
        settings.templateTop = response.transactions.defaults.template.top;
        settings.modal = response.transactions.defaults.modal;
        state.settings = settings;
        getTransactions();
      }).catch(function(error) {
        status.noSettings = true;
        status.errorView = true;
        state.messages = {
          error: Array.isArray(error) ? error : [error]
        };
      });

    $scope.changePeriod = function(value) {
      params = {
        from: $routeParams.from,
        to: $routeParams.to,
        transactions: $routeParams.id
      };
      if (value == 'd') {
        params.from = moment(params.from).subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
        params.to = moment(params.to).subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
      } else {
        params.from = moment(params.from).add(1, 'months').startOf('month').format('YYYY-MM-DD');
        params.to = moment(params.to).add(1, 'months').endOf('month').format('YYYY-MM-DD');
      }
      $location.path(`/transactions/from=${params.from}&to=${params.to}&transactions=all`);
    };

    $scope.todayRecords = function() {
      $location.path(`/transactions/from=${moment().format('YYYY-MM-DD')}&to=${moment().format('YYYY-MM-DD')}&transactions=all`);
    };

    $scope.seeDetails = function(key, title) {
      modal.title = title.transactionTypeDescription;
      modal.cssClass = settings.modal.details.cssClass;
      modal.url = settings.modal.details.url;
      state.modal = modal;
      data.transactionsDetails = _.filter(data.transactions, function(item) {
        if (item.transactionType == key) {
          return item;
        }
      });
    };

    $scope.search = function() {
      status.isLoadingModal = true;
      modal.title = settings.modal.search.title
      modal.cssClass = settings.modal.search.cssClass;
      modal.url = settings.modal.search.url;
      state.modal = modal;
      getActiveTransactionsType();
    };

    $scope.customSearchForm = function($valid) {
      if(!$valid) {
        return;
      }
      if(data.customSearch.transactionType == undefined) {
        params.transactions = setTransactionsType();
      } else {
        params.transactions = data.customSearch.transactionType;
      }
      if (data.customSearch.checked) {
        params.transactions.push(0); // 0 = purchases
      }
      params.from = data.customSearch.from;
      params.to = data.customSearch.to;
      $(".modal").modal("hide");
      $timeout(function() {
        $location.path(`/transactions/from=${params.from}&to=${params.to}&transactions=${params.transactions}`);
      }, 500);
    };

    $scope.modalAddNewRecord = function() {
      getActiveTransactionsType();
      getActiveBanks();
      data.typeAction = TransactionTypeServices.getTransactionTypeAction();
      modal.title = settings.modal.add.title
      modal.cssClass = settings.modal.add.cssClass;
      modal.url = settings.modal.add.url;
      state.modal = modal;
    };

    $scope.checkTransactionTypeAction = function (model) {
      let bankFromDescription = '';
      let bankToDescription = '';
      if (model.transactionTypeAction === data.typeAction[3].value) {
        _.find(data.banks, function(bank){
          if (data.form.transactionFromBank == bank.id) {
            bankFromDescription = bank.bankDescription;
          }
          if (data.form.transactionToBank == bank.id) {
            bankToDescription = bank.bankDescription;
          }
        });
        return data.form.transactionComments = `FROM: ${bankFromDescription.toUpperCase()}, TO: ${bankToDescription.toUpperCase()}`
      }
      return data.form.transactionComments = '';
    };

    $scope.saveTransaction = function($valid) {
      status.errorAdd = true;
      if (status.isSaving) {
        return;
      }
      if (!$valid) {
        state.messages = {
          error: [{
            msg: state.settings.component.defaults.message.required
          }]
        };
        return;
      }
      status.isValidForm = checkAmount();
      switch(data.form.transactionType.transactionTypeAction) {
        case 'C':
          status.isValidForm = checkAmount();
          break;
        case 'D':
          status.isValidForm = checkDebit();
          break;
        case 'T':
          status.isValidForm = checkTransfer();
          break;
        default:
          status.isValidForm = false;
      }
      if(!status.isValidForm) {
        return;
      }

      status.isSaving = true;
      TransactionServices.save(data.form)
        .then(function(response) {
          status.isSaving = false;
          state.messages = {
            success: [response]
          };
          getActiveBanks();
          getTransactions();
          data.form = {};
        }).catch(function(error) {
          status.isSaving = false;
          state.messages = {
            error: Array.isArray(error) ? error : [error]
          };
        });
    };

    $scope.checkDelete = function(transactionID) {
      return transactionID.showConfirmDelete = transactionID.showConfirmDelete ? false : true;
    };

    function checkAmount() {
      if (parseFloat(data.form.transactionAmount) === 0) {
        state.messages = {
          error: [{
            msg: state.settings.component.defaults.message.notZero
          }]
        };
        return false;
      }
      return true;
    };

    function checkFunds() {
      let enoughFunds = 0;
      return enoughFunds = _.find(data.banks, function(bank) {
        return bank.id == data.form.transactionFromBank;
      });
    };

    function checkDebit() {
      let enoughFunds = checkFunds();
      if (parseFloat(data.form.transactionAmount) > parseFloat(enoughFunds.bankCurrentBalance)) {
        state.messages = {
          error: [{
            msg: status.noBalance(data.form.transactionAmount, enoughFunds.bankCurrentBalance)
          }]
        };
        return false;
      }
      return true;
    };

    function checkTransfer() {
      let enoughFunds = checkFunds();
      if (data.form.transactionToBank == 0 || data.form.transactionToBank == undefined) {
        return false;
      }
      if (data.form.transactionFromBank == data.form.transactionToBank) {
        state.messages = {
          error: [{
            msg: state.settings.component.defaults.message.notEqualBanks
          }]
        };
        return false;
      }
      if (parseFloat(data.form.transactionAmount) > parseFloat(enoughFunds.bankCurrentBalance)) {
        state.messages = {
          error: [{
            msg: status.noBalance(data.form.transactionAmount, enoughFunds.bankCurrentBalance)
          }]
        };
        return false;
      }
      return true;
    };

    function getTransactions() {
      TransactionServices.getTransactionsByCustomSearch(params)
        .then(function(response) {
          status.isNull = false;
          status.isLoading = false;
          data.transactions = response.data;
          if(response.data.length === 0) {
            status.isNull = true;
          }
          data.transactionsByGroup = response.groupedBy;
        }).catch(function(error){
          status.isNull = false;
          status.isLoading = false;
          state.messages = {
            error: Array.isArray(error) ? error : [error]
          };
        });
    };

    function getActiveTransactionsType() {
      TransactionTypeServices.getActiveTransactionsType()
        .then(function(response) {
          status.errorAdd = false;
          status.errorSearch = false;
          data.transactionsType = response;
          status.isLoadingTransactionsType = false;
        }).catch(function(error) {
          status.errorAdd = true;
          status.errorSearch = true;
          status.isLoadingTransactionsType = false;
          state.messages = {
            error: Array.isArray(error) ? error : [error]
          };
        });
    };

    function getActiveBanks() {
      BankServices.getActiveBanks()
        .then(function(response) {
          data.banks = response;
          status.isLoadingBanks = false;
        }).catch(function(error) {
          status.isLoadingBanks = false;
          state.messages = {
            error: Array.isArray(error) ? error : [error]
          };
        });
    };

    function setTransactionsType() {
      let transactions = [];
      _.forEach(data.transactionsType, function(transaction) {
        transactions.push(transaction.id);
      });
      return transactions;
    };

    $scope.state = state;
    $scope.data = data;
  }]);
