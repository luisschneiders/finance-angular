angular.module('MyApp')
  .controller('PeopleUpdateCtrl', ['$scope', '$auth', '$location', '$timeout', '$routeParams', 'DefaultServices', 'PeopleServices',
  function($scope, $auth, $location, $timeout, $routeParams, DefaultServices, PeopleServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }

    let peopleId = $routeParams.id;
    let newRecord = null;
    let noRecord = {
      msg: 'No Record Found!'
    };

    $scope.state = {};
    $scope.data = [];
    $scope.form = {};
    $scope.state.noSettings = true;
    $scope.typeAction = PeopleServices.getPeopleType();

    if (Number.isInteger(parseInt(peopleId))) {
      newRecord = false;
    } else {
      newRecord = true;
    }

    setControllerSettings(newRecord);

    $scope.savePeople = function($valid) {
      if ($scope.state.isSaving) {
        return;
      }
      if(!$valid) {
        return;
      }
      $scope.state.isSaving = true;
      PeopleServices.save(newRecord, $scope.form)
        .then(function(response) {
          $scope.state.isSaving = false;
          $scope.state.messages = {
            success: [response]
          };
          if(newRecord) {
            $timeout(function() {
              $location.path(`/user=${response.people.id}`);
            }, 1000);
          }
        }).catch(function(error) {
          $scope.state.isSaving = false;
          $scope.state.messages = {
            error: Array.isArray(error) ? error : [error]
          };
        });
    };

    function setControllerSettings(newRecord) {
      DefaultServices.getSettings()
      .then(function(response) {
        $scope.state.noSettings = false;
        if(!newRecord) {
          getPeople(peopleId);
          DefaultServices.setTop(response.people.existingRecord.top);
        } else {
          $scope.form = response.people.defaults.form;
          DefaultServices.setTop(response.people.newRecord.top);
        }
      }).catch(function(error) {
        $scope.state.noSettings = true;
        $scope.state.messages = {
          error: Array.isArray(error) ? error : [error]
        };
      });
    };

    function getPeople(id) {
      PeopleServices.getPeopleById(id)
        .then(function(response) {
          if(!response) {
            $scope.state.isNull = true;
            $scope.state.messages = {
              error: Array.isArray(noRecord) ? noRecord : [noRecord]
            };
            return;
          }
          $scope.state.isNull = false;
          $scope.form = response;
        }).catch(function(error) {
          $scope.state.isNull = true;
          $scope.state.messages = {
            error: Array.isArray(error) ? error : [error]
          };
        });
    };
  }]);
