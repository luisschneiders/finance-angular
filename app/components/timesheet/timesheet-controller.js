angular.module('MyApp')
  .controller('TimesheetCtrl', ['$scope', '$auth', '$location', '$routeParams', 'moment', 'DefaultServices',
  function($scope, $auth, $location, $routeParams, moment, DefaultServices) {
    if (!$auth.isAuthenticated()) {
      $location.url('/login');
      return;
    }

    class State {
      constructor(settings, params, status, messages, modal, fieldDisabled) {
        this.settings = settings;
        this.params = params;
        this.status = status;
        this.messages = messages;
        this.modal = modal;
        this.fieldDisabled = fieldDisabled;
      }
    };
    class Params {
      constructor($routeParams) {
        this.calendar = $routeParams.calendar;
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
        this.errorView = false;
      }
    };
    class Modal {
      constructor(title, cssClass, url){
        this.title = title;
        this.cssClass = cssClass;
        this.url = url;
      }
    };
    class Data {
      constructor(purchases, purchasesByGroup, purchasesDetails, expensesType, banks, form, customSearch, remainingAmount) {
        this.purchases = purchases;
        this.purchasesByGroup = purchasesByGroup;
        this.purchasesDetails = purchasesDetails;
        this.expensesType = expensesType;
        this.banks = banks;
        this.form = form;
        this.customSearch = customSearch;
        this.remainingAmount = remainingAmount;
      }
    };

    let vm = this;

    vm.settings = new Settings();
    vm.modal = new Modal();
    vm.params = new Params($routeParams);
    vm.status = new Status();
    vm.data = new Data();
    vm.state = new State(null, vm.params, vm.status, null, null, false);
    vm.paramsLFS = vm.params;

    DefaultServices.getSettings()
      .then(function(response) {
        vm.status.noSettings = false;
        vm.status.errorView = false;
        vm.status.isLoading = false;
        vm.settings.defaults = response.defaults;
        vm.settings.component = response.timesheets;
        vm.settings.templateTop = response.timesheets.defaults.template.top;
        vm.settings.modal = response.timesheets.defaults.modal;
        vm.state.settings = vm.settings;
      }).catch(function(error) {
        vm.status.noSettings = true;
        vm.status.errorView = true;
        vm.state.messages = {
          error: Array.isArray(error) ? error : [error]
        };
      });

    this.modalAddNewRecord = function() {
      vm.modal.title = vm.settings.modal.add.title
      vm.modal.cssClass = vm.settings.modal.add.cssClass;
      vm.modal.url = vm.settings.modal.add.url;
      vm.state.modal = vm.modal;
    };

  }]);
