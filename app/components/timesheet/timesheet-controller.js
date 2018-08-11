angular.module('MyApp')
  .controller('TimesheetCtrl', ['$scope', '$auth', '$location', '$routeParams', '$window',
              'DefaultServices', 'PeopleServices', 'TimesheetServices', 'UserLocalStorageServices',
  function($scope, $auth, $location, $routeParams, $window, DefaultServices, PeopleServices, TimesheetServices, UserLocalStorageServices) {
    if (!$auth.isAuthenticated()) {
      $location.url('/login');
      return;
    }

    class State {
      constructor(settings, params, status, messages, modal, switchBtn, isNewRate) {
        this.settings = settings;
        this.params = params;
        this.status = status;
        this.messages = messages;
        this.modal = modal;
        this.switchBtn = switchBtn;
        this.isNewRate = isNewRate;
      }
    };
    class Params {
      constructor($routeParams) {
        this.calendar = $routeParams.calendar;
        this.path = $location.path();
        this.view = JSON.parse($window.localStorage.userSettings).timesheetsView;
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
        this.isLoadingPeople = true;
        this.noSettings = true;
        this.isSaving = false;
        this.errorAdd = false;
        this.errorSearch = false;
        this.errorView = false;
        this.isValidTime = false;
      }

      checkPunch(punchIn, punchOut) {
        return `Punch Out ${moment(punchOut).format('hh:mm a')} must be higher than Punch In ${moment(punchIn).format('hh:mm a')}
        for the period, please check!`
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
      constructor(timesheets, people) {
        this.timesheets = timesheets;
        this.people = people;
      }
    };

    let vm = this;
    vm.totalPaid = 0;
    vm.totalUnpaid = 0;
    vm.view = {
      calendar: 'calendar',
      list: 'list/row'
    };
    vm.role = 1;
    vm.settings = new Settings();
    vm.modal = new Modal();
    vm.params = new Params($routeParams);
    vm.status = new Status();
    vm.data = new Data();
    vm.state = new State(null, vm.params, vm.status, null, null, vm.view, false);
    vm.switchAlternate = vm.params.view;

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

    vm.getPaid = function(value) {
      return vm.totalPaid + value;
    }

    vm.getUnpaid = function(value) {
      return vm.totalUnpaid + value;
    }

    vm.modalAddNewRecord = function() {
      vm.modal.title = vm.settings.modal.add.title
      vm.modal.cssClass = vm.settings.modal.add.cssClass;
      vm.modal.url = vm.settings.modal.add.url;
      vm.state.modal = vm.modal;
      vm.getPeople();
    };

    vm.getPeople = function() {
      PeopleServices.getPeopleByRole(vm.role)
        .then(function(response) {
          vm.data.people = response;
          vm.status.isLoadingPeople = false;
        }).catch(function(error) {
          vm.status.noSettings = true;
          vm.status.errorView = true;
          vm.status.isLoadingPeople = false;
          vm.state.messages = {
            error: Array.isArray(error) ? error : [error]
          };
        });
    };

    vm.saveTimesheet = function($valid) {
      vm.status.errorAdd = true;


      console.log('vm.data.form.timesheetTimeIn', vm.data.form.timesheetTimeIn);

      // if (vm.status.isSaving) {
      //   return;
      // }

      // if (!$valid) {
      //   vm.state.messages = {
      //     error: [{
      //       msg: vm.state.settings.component.defaults.message.required
      //     }]
      //   };
      //   return;
      // }

      vm.status.isValidTime = checkTime();

      // if (!vm.status.isValidTime) {
      //   vm.state.messages = {
      //     error: [{
      //       msg: vm.state.settings.component.defaults.message.time
      //     }]
      //   };
      //   return;
      // };

      // if (vm.data.form.timesheetTimeIn >= vm.data.form.timesheetTimeOut) {
      //   vm.state.messages = {
      //     error: [{
      //       msg: vm.status.checkPunch(vm.data.form.timesheetTimeIn, vm.data.form.timesheetTimeOut)
      //     }]
      //   };
      //   return;
      // }

      status.isSaving = true;

      TimesheetServices.save(vm.data.form)
        .then(function(response) {
          vm.status.isSaving = false;
          vm.state.messages = {
            success: [response]
          };
          vm.data.form = {};
        }).catch(function(error) {
          vm.status.isSaving = false;
          vm.state.messages = {
            error: Array.isArray(error) ? error : [error]
          };
        });

    };

    $scope.changeView = function(params, value) {
      vm.totalPaid = 0;
      vm.totalUnpaid = 0;
      UserLocalStorageServices.updateUserSettings(params, value)
    }

    function checkTime() {
      let punchIn = moment(vm.data.form.timesheetTimeIn, 'hh:mm', true).isValid();
      let punchOut = moment(vm.data.form.timesheetTimeOut, 'hh:mm', true).isValid();
      let timeBreak = true;

      if (vm.data.form.timesheetTimeBreak) {
        timeBreak = moment(vm.data.form.timesheetTimeBreak, 'hh:mm', true).isValid();
      }
      
      if (punchIn && punchOut && timeBreak) {
        return true;
      }

      return false;
    }

  }]);
