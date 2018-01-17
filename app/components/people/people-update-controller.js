angular.module('MyApp')
  .controller('PeopleUpdateCtrl', ['$scope', '$auth', '$location', '$timeout', 'DefaultServices', 'PeopleServices', function($scope, $auth, $location, $timeout, DefaultServices, PeopleServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }

    let peopleId = $location.path().substr(6); // to remove path /user/
    let newRecord = true;

    $scope.settings = {};
    $scope.data = [];
    $scope.form = {};
    $scope.typeAction = PeopleServices.getPeopleType();

    if (Number.isInteger(parseInt(peopleId))) {
      newRecord = false;
      setControllerSettings(newRecord);
    } else {
      newRecord = true;
      setControllerSettings(newRecord);
    }

    $scope.savePeople = function($valid) {
      if ($scope.settings.people.defaults.isSaving) {
        return;
      }
      if(!$valid) {
        return;
      }
      $scope.settings.people.defaults.isSaving = true;

      PeopleServices.save(newRecord, $scope.form)
        .then(function(response) {
          $scope.settings.people.defaults.isSaving = false;
          $scope.settings.people.defaults.messages = {
            success: [response.data]
          };
          if(newRecord) {
            $timeout(function() {
              $location.path(`/user/${response.data.people.id}`);
            }, 1000);
            return
          }
        }).catch(function(response) {
          console.warn('Error saving user: ', response);
          $scope.settings.people.defaults.isSaving = false;
          $scope.settings.people.defaults.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };

    function setControllerSettings(newRecord) {
      DefaultServices.getSettings()
      .then(function(response) {
        $scope.settings = response;
        setTop(newRecord, response);
        setForm(newRecord, response);
        if(!newRecord) {
          getPeople(peopleId);
        }
      }).catch(function(err) {
        console.warn('Error getting settings: ', err)
      });
    };

    function setTop(newRecord, settings) {
      if (newRecord) {
        DefaultServices.setTop(settings.people.newRecord.top);
        return;
      }
      DefaultServices.setTop(settings.people.existingRecord.top);
    };

    function setForm(newRecord, settings) {
      if (newRecord) {
        $scope.form = settings.people.defaults.form;
        return;
      }
    };

    function getPeople(id) {
      PeopleServices.getPeopleById(id)
        .then(function(response) {
          if(!response || response.length == 0) {
            $scope.settings.people.defaults.isNull = true;
            return;
          }
          $scope.settings.people.defaults.isNull = false;
          $scope.form = response;
        }).catch(function(err) {
          console.warn('Error getting user: ', err);
        });
    };
  }]);
