angular.module('MyApp')
  .controller('PurchaseCtrl', ['$scope', '$auth', '$location', '$timeout', '$routeParams', 'moment', 'DefaultServices', 'ExpenseTypeServices', 'BankServices', 'PurchaseServices',
  function($scope, $auth, $location, $timeout, $routeParams, moment, DefaultServices, ExpenseTypeServices, BankServices, PurchaseServices) {
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
        this.expenses = $routeParams.id;
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
        this.isLoadingExpensesType = true;
        this.noSettings = true;
        this.isSaving = false;
        this.errorAdd = false;
        this.errorSearch = false;
        this.errorVIew = false;
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
      constructor(purchases, purchasesByGroup, purchasesDetails, expensesType, banks, form, customSearch) {
        this.purchases = purchases;
        this.purchasesByGroup = purchasesByGroup;
        this.purchasesDetails = purchasesDetails;
        this.expensesType = expensesType;
        this.banks = banks;
        this.form = form;
        this.customSearch = customSearch;
      }
    };

    let settings = new Settings();
    let modal = new Modal();
    let params = new Params($routeParams);
    let status = new Status();
    let state = new State(null, params, status, null, null);
    let data = new Data();

    DefaultServices.getSettings()
      .then(function(response) {
        status.noSettings = false;
        status.errorView = false;
        settings.defaults = response.defaults;
        settings.component = response.purchases;
        settings.templateTop = response.purchases.defaults.template.top;
        settings.modal = response.purchases.defaults.modal;
        state.settings = settings;
        getPurchases();
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
        expenses: $routeParams.id
      };
      if (value == 'd') {
        params.from = moment(params.from).subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
        params.to = moment(params.to).subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
      } else {
        params.from = moment(params.from).add(1, 'months').startOf('month').format('YYYY-MM-DD');
        params.to = moment(params.to).add(1, 'months').endOf('month').format('YYYY-MM-DD');
      }
      $location.path(`/purchases/from=${params.from}&to=${params.to}&expenses=all`);
    };

    $scope.todayRecords = function() {
      $location.path(`/purchases/from=${moment().format('YYYY-MM-DD')}&to=${moment().format('YYYY-MM-DD')}&expenses=all`);
    };

    $scope.seeDetails = function(key, title) {
      modal.title = title.expenseTypeDescription;
      modal.cssClass = settings.modal.details.cssClass;
      modal.url = settings.modal.details.url;
      state.modal = modal;
      data.purchasesDetails = _.filter(data.purchases, function(item) {
        if (item.purchaseExpenseId == key) {
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
      getActiveExpensesType();
    };

    $scope.customSearchForm = function($valid) {
      if(!$valid) {
        return;
      }
      if(data.customSearch.expenseType == undefined) {
        params.expenses = 'all';
      } else {
        params.expenses = data.customSearch.expenseType;
      }
      params.from = data.customSearch.from;
      params.to = data.customSearch.to;
      $(".modal").modal("hide");
      $timeout(function() {
        $location.path(`/purchases/from=${params.from}&to=${params.to}&expenses=${params.expenses}`);
      }, 500);
    };

    $scope.modalAddNewRecord = function() {
      getActiveExpensesType();
      getActiveBanks();
      modal.title = settings.modal.add.title
      modal.cssClass = settings.modal.add.cssClass;
      modal.url = settings.modal.add.url;
      state.modal = modal;
    };

    $scope.savePurchase = function($valid) {
      let checKBalance = null;
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

      checKBalance = _.find(data.banks, function(bank) {
        return bank.id == data.form.purchaseBank;
      });

      if (parseFloat(data.form.purchaseAmount) > parseFloat(checKBalance.bankCurrentBalance)) {
        state.messages = {
          error: [{
            msg: status.noBalance(data.form.purchaseAmount, checKBalance.bankCurrentBalance)
          }]
        };
        return;
      }
      status.isSaving = true;
      PurchaseServices.save(data.form)
        .then(function(response) {
          status.isSaving = false;
          state.messages = {
            success: [response]
          };
          getActiveBanks();
          getPurchases();
          data.form = {};
        }).catch(function(error) {
          status.isSaving = false;
          state.messages = {
            error: Array.isArray(error) ? error : [error]
          };
        });
    };

    function getPurchases() {
      PurchaseServices.getPurchasesByCustomSearch(params)
        .then(function(response) {
          status.isLoading = false;
          data.purchases = response.data;
          if(response.data.length === 0) {
            status.isNull = true;
          }
          data.purchasesByGroup = response.groupedBy;
        }).catch(function(error){
          state.messages = {
            error: Array.isArray(error) ? error : [error]
          };
        });
    };

    function getActiveExpensesType() {
      ExpenseTypeServices.getActiveExpensesType()
        .then(function(response) {
          status.errorAdd = false;
          status.errorSearch = false;
          data.expensesType = response;
          status.isLoadingExpensesType = false;
        }).catch(function(error) {
          status.errorAdd = true;
          status.errorSearch = true;
          status.isLoadingExpensesType = false;
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

    $scope.state = state;
    $scope.data = data;
  }]);
