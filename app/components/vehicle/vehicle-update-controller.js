angular.module('MyApp')
  .controller('VehicleUpdateCtrl', ['$scope', '$auth', '$location', '$timeout', '$routeParams', 'DefaultServices', 'VehicleServices',
  function($scope, $auth, $location, $timeout, $routeParams, DefaultServices, VehicleServices) {
    if (!$auth.isAuthenticated()) {
      $location.url('/login');
      return;
    }
    class State {
      constructor(settings, params, status, messages) {
        this.settings = settings;
        this.params = params;
        this.status = status;
        this.messages = messages;
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
        this.id = $routeParams.id;
      }
    };
    class Status {
      constructor(isLoading, noSettings, newRecord, isNull, isSaving) {
        this.isLoading = isLoading;
        this.noSettings = noSettings;
        this.newRecord = newRecord;
        this.isNull = isNull;
        this.isSaving = isSaving;
      }
      noRecord() {
        return { msg: 'No Record Found!' }
      };
    };
    class Data {
      constructor(form) {
        this.form = form;
      }
    };

    let settings = new Settings();
    let params = new Params($routeParams);
    let status = new Status(true, true, null, false, false);
    let data = new Data();
    let state = new State(settings, params, status, null);

    if (Number.isInteger(parseInt(params.id))) {
      status.newRecord = false;
    } else {
      status.newRecord = true;
    }

    setControllerSettings(status.newRecord);

    $scope.addNewRecord = function() {
      $location.url(state.settings.templateTop.buttonUrl);
    }

    $scope.saveVehicle = function($valid) {
      if (status.isSaving) {
        return;
      }
      if(!$valid) {
        return;
      }
      status.isSaving = true;
      VehicleServices.save(status.newRecord, data.form)
        .then(function(response) {
          status.isSaving = false;
          state.messages = {
            success: [response]
          };
          if(status.newRecord) {
            $timeout(function() {
              $location.url(`/vehicle=${response.vehicle.id}`);
            }, 1000);
          }
        }).catch(function(error) {
          status.isSaving = false;
          state.messages = {
            error: Array.isArray(error) ? error : [error]
          };
        });
    };

    function setControllerSettings(newRecord) {
      DefaultServices.getSettings()
      .then(function(response) {
        status.noSettings = false;
        if(!newRecord) {
          getVehicle(params.id);
          settings.templateTop = response.vehicle.existingRecord.template.top;
        } else {
          settings.templateTop = response.vehicle.newRecord.template.top;
          data.form = response.vehicle.newRecord.form;
        }
      }).catch(function(error) {
        status.noSettings = true;
        state.messages = {
          error: Array.isArray(error) ? error : [error]
        };
      });
    };

    function getVehicle(id) {
      VehicleServices.getVehicleById(id)
        .then(function(response) {
          if(!response) {
            status.isNull = true;
            state.messages = {
              error: Array.isArray(status.noRecord()) ? status.noRecord() : [status.noRecord()]
            };
            return;
          }
          status.isNull = false;
          data.form = response;
        }).catch(function(error) {
          status.isNull = true;
          state.messages = {
            error: Array.isArray(error) ? error : [error]
          };
        });
    };

    $scope.state = state;
    $scope.data = data;
  }]);
