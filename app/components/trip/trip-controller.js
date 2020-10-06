angular.module('MyApp')
  .controller('TripCtrl', ['$scope', '$auth', '$location', '$routeParams', '$window', '$timeout',
              'DefaultServices', 'TripServices', 'UserLocalStorageServices',
  function($scope, $auth, $location, $routeParams, $window, $timeout, DefaultServices, TripServices, UserLocalStorageServices) {
    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };
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
        this.view = JSON.parse($window.localStorage.userSettings).tripsView;
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
      constructor(trip) {
        this.trip = trip;
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
        vm.settings.component = response.trips;
        vm.settings.templateTop = response.trips.defaults.template.top;
        vm.settings.modal = response.trips.defaults.modal;
        vm.state.settings = vm.settings;
      }).catch(function(error) {
        vm.status.noSettings = true;
        vm.status.errorView = true;
        vm.state.messages = {
          error: Array.isArray(error) ? error : [error]
        };
      });

    vm.modalAddNewRecord = function() {
      vm.data.form = {};
      vm.state.messages = {};
      vm.modal.title = vm.settings.modal.add.title
      vm.modal.cssClass = vm.settings.modal.add.cssClass;
      vm.modal.url = vm.settings.modal.add.url;
      vm.state.modal = vm.modal;
    };

    vm.saveTrip = function($valid) {
      vm.status.errorAdd = true;

      if (vm.status.isSaving) {
        return;
      }

      if (!$valid) {
        vm.state.messages = {
          error: [{
            msg: vm.state.settings.component.defaults.message.required
          }]
        };
        return;
      }

      vm.status.isSaving = true;

      TripServices.save(vm.data.form)
        .then(function(response) {
          vm.status.isSaving = false;
          vm.state.messages = {
            success: [response]
          };
          vm.data.form = {};

          $scope.tripView();

        }).catch(function(error) {
          vm.status.isSaving = false;
          vm.state.messages = {
            error: Array.isArray(error) ? error : [error]
          };
        });
    };

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

    vm.deleteTrip = function($valid) {
      vm.status.errorAdd = true;

      if (vm.status.isSaving) {
        return;
      }

      if (!$valid) {
        vm.state.messages = {
          error: [{
            msg: vm.state.settings.component.defaults.message.idMissing
          }]
        };
        return;
      }
      vm.status.isSaving = true;

      TripServices.removeTrip(vm.data.form)
        .then(function(response) {
          vm.status.isSaving = false;
          vm.state.messages = {
            success: [response]
          };
          vm.data.form = {};

          $timeout(function() {
            angular.element('#myModal').modal('hide');
          }, 1000);

          $scope.tripView();

        }).catch(function(error) {
          vm.status.isSaving = false;
          vm.state.messages = {
            error: Array.isArray(error) ? error : [error]
          };
        });
    };

    $scope.changeView = function(params, value) {
      UserLocalStorageServices.updateUserSettings(params, value);
    }

  }]);
