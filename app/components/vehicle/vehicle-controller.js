angular.module('MyApp')
  .controller('VehicleCtrl', ['$scope', '$auth', '$location', '$routeParams', 'DefaultServices', 'VehicleServices', 'UserLocalStorageServices',
  function($scope, $auth, $location, $routeParams, DefaultServices, VehicleServices, UserLocalStorageServices) {
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
      constructor(vehicles) {
        this.vehicles = vehicles;
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
        settings.component = response.vehicle;
        settings.templateTop = response.vehicle.defaults.template.top;
        state.settings = settings;
        getVehicles();
      }).catch(function(error) {
        status.noSettings = true;
        state.messages = {
          error: Array.isArray(error) ? error : [error]
        };
      });

    $scope.editVehicle = function(id) {
      $location.url(`/vehicle=${id}`);
    };

    $scope.previousPage = function() {
      $location.url(`${$location.path()}?page=${state.pagination.page - 1}&pageSize=${state.pagination.pageSize}`);
    };

    $scope.nextPage = function() {
      $location.url(`${$location.path()}?page=${state.pagination.page + 1}&pageSize=${state.pagination.pageSize}`);
    };

    $scope.refreshList = function(pageSize) {
      $location.url(`${$location.path()}?page=${state.pagination.page}&pageSize=${pageSize}`);
      UserLocalStorageServices.updateUserSettings('vehiclesPageSize', pageSize);
    };

    $scope.addNewRecord = function() {
      $location.url(state.settings.templateTop.buttonUrl);
    }

    function getVehicles() {
      VehicleServices.getAllVehicles(params)
        .then(function(response) {
          status.isLoading = false;
          data.vehicles = response.vehicles;
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
