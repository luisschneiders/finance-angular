angular.module('MyApp')
  .controller('PeopleUpdateCtrl', ['$scope', '$auth', '$location', '$timeout', '$routeParams', 'DefaultServices', 'PeopleServices',
  function($scope, $auth, $location, $timeout, $routeParams, DefaultServices, PeopleServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
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
      constructor(form, typeAction) {
        this.form = form;
        this.typeAction = typeAction;
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

    $scope.savePeople = function($valid) {
      if (status.isSaving) {
        return;
      }
      if(!$valid) {
        return;
      }
      status.isSaving = true;
      PeopleServices.save(status.newRecord, data.form)
        .then(function(response) {
          status.isSaving = false;
          state.messages = {
            success: [response]
          };
          if(status.newRecord) {
            $timeout(function() {
              $location.path(`/user=${response.people.id}`);
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
          getPeople(params.id);
          settings.templateTop = response.people.existingRecord.template.top;
        } else {
          settings.templateTop = response.people.newRecord.template.top;
          data.form = response.people.newRecord.form;
        }
        data.typeAction = PeopleServices.getPeopleType();
      }).catch(function(error) {
        status.noSettings = true;
        state.messages = {
          error: Array.isArray(error) ? error : [error]
        };
      });
    };

    function getPeople(id) {
      PeopleServices.getPeopleById(id)
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
