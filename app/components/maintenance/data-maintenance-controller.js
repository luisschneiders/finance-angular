angular.module('MyApp')
  .controller('DataMaintenanceCtrl', ['$scope', '$auth', '$location', '$window', '$routeParams', 'DefaultServices', 'DataMaintenanceServices', 'UserLocalStorageServices',
  function($scope, $auth, $location, $window, $routeParams, DefaultServices, DataMaintenanceServices, UserLocalStorageServices) {
    if (!$auth.isAuthenticated()) {
      $location.url('/login');
      return;
    }

    class State {
      constructor(settings, params, status, messages, modal, switchBtn) {
        this.settings = settings;
        this.params = params;
        this.status = status;
        this.messages = messages;
        this.modal = modal;
        this.switchBtn = switchBtn;

      }
    };
    class Params {
      constructor($routeParams) {
        this.calendar = $routeParams.calendar;
        this.path = $location.path();
        this.view = JSON.parse($window.localStorage.userSettings).dataMaintenanceView;
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
        this.isLoadingModal = true;
        this.isLoadingPeople = true;
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
      constructor(transactions, purchases) {
        this.transactions = transactions;
        this.purchases = purchases;
      }
    };

    let vm = this;
    vm.view = {
      calendar: 'calendar',
      list: 'list/row'
    };
    vm.settings = new Settings();
    vm.modal = new Modal();
    vm.params = new Params($routeParams);
    vm.status = new Status();
    vm.data = new Data();
    vm.state = new State(null, vm.params, vm.status, null, null, vm.view);
    vm.switchAlternate = vm.params.view;

    DefaultServices.getSettings()
      .then(function(response) {
        vm.status.noSettings = false;
        vm.status.errorView = false;
        vm.settings.defaults = response.defaults;
        vm.settings.component = response.dataMaintenance;
        vm.settings.templateTop = response.dataMaintenance.defaults.template.top;
        vm.settings.modal = response.dataMaintenance.defaults.modal;
        vm.state.settings = vm.settings;
      }).catch(function(error) {
        vm.status.noSettings = true;
        vm.status.errorView = true;
        vm.state.messages = {
          error: Array.isArray(error) ? error : [error]
        };
      });

    vm.modalDeleteRecord = function(data) {
      vm.data.form = {};
      vm.state.messages = {};
      vm.modal.title = vm.settings.modal.remove.title
      vm.modal.cssClass = vm.settings.modal.remove.cssClass;
      vm.modal.url = vm.settings.modal.remove.url;
      vm.state.modal = vm.modal;
      vm.data.form.id = data.id;
      angular.element('#myModal').modal('show');
    };

    $scope.changeView = function(params, value) {
      UserLocalStorageServices.updateUserSettings(params, value)
    }

  }]);
