angular.module('MyApp')
  .controller('BankCtrl', ['$scope', '$auth', '$location', '$routeParams', 'DefaultServices', 'BankServices', 'UserLocalStorageServices',
  function($scope, $auth, $location, $routeParams, DefaultServices, BankServices, UserLocalStorageServices) {
    if (!$auth.isAuthenticated()) {
      $location.url('/login');
      return;
    }
    class State {
      constructor(settings, params, status, messages, pagination, pageSize) {
        this.settings = settings;
        this.params = params;
        this.status = status;
        this.messages = messages;
        this.pagination = pagination;
        this.pageSize = pageSize;
      }
    };
    class Settings {
      constructor(defaults, component, templateTop) {
        this.defaults = defaults;
        this.component = component;
        this.templateTop = templateTop;
      }
    };
    class Params {
      constructor($routeParams) {
        this.page = $routeParams.page;
        this.pageSize = $routeParams.pageSize;
      }
    };
    class Status {
      constructor(isLoading, noSettings) {
        this.isLoading = isLoading;
        this.noSettings = noSettings;
      }
    };
    class Data {
      constructor(banks) {
        this.banks = banks;
      }
    };

    let settings = new Settings();
    let params = new Params($routeParams);
    let status = new Status(true, true);
    let data = new Data();
    let state = new State(settings, params, status, null, null, null);

    DefaultServices.getSettings()
      .then(function(response) {
        status.noSettings = false;
        settings.defaults = response.defaults;
        settings.component = response.bank;
        settings.templateTop = response.bank.defaults.template.top;
        state.settings = settings;
        getBanks();
      }).catch(function(error) {
        status.noSettings = true;
        state.messages = {
          error: Array.isArray(error) ? error : [error]
        };
      });

    $scope.editBank = function(id) {
      $location.url(`/bank=${id}`);
    };

    $scope.previousPage = function() {
      $location.url(`${$location.path()}?page=${state.pagination.page - 1}&pageSize=${state.pagination.pageSize}`);
    };

    $scope.nextPage = function() {
      $location.url(`${$location.path()}?page=${state.pagination.page + 1}&pageSize=${state.pagination.pageSize}`);
    };

    $scope.refreshList = function(pageSize) {
      $location.url(`${$location.path()}?page=${state.pagination.page}&pageSize=${pageSize}`);
      UserLocalStorageServices.updateUserSettings('banksPageSize', pageSize);
    };

    $scope.addNewRecord = function() {
      $location.url(state.settings.templateTop.buttonUrl);
    }

    function getBanks() {
      BankServices.getAllBanks(params)
        .then(function(response) {
          status.isLoading = false;
          data.banks = response.banks;
          state.pagination = response.pagination;
        }).catch(function(error) {
          status.isLoading = false;
          state.messages = {
            error: Array.isArray(error) ? error : [error]
          };
        });
    };

    $scope.state = state;
    $scope.data = data;
  }]);
