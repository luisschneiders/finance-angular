angular.module('MyApp')
  .controller('PeopleCtrl', ['$scope', '$auth', '$location', 'PeopleServices', 'DefaultServices', function($scope, $auth, $location, PeopleServices, DefaultServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }

    $scope.settings = {};
    $scope.data = [];

  DefaultServices.getSettings()
    .then(function(response) {
      $scope.settings = response;
      setTop(response);
      getPeople(response);
    }).catch(function(err) {
      console.warn('Error getting users: ', err);
    });

  $scope.editPeople = function(id) {
    $location.path(`/user/${id}`);
  };

  function setTop(settings) {
    DefaultServices.setTop(settings.people.defaults.top);
  };

  function getPeople(settings) {
    PeopleServices.getAllPeople(settings.people.defaults.isActive)
      .then(function(response) {
        if(!response || response.length == 0) {
          $scope.settings.people.defaults.isNull = true;
          $scope.settings.people.defaults.isLoading = false;
          return;
        }

        $scope.settings.people.defaults.isLoading = false;
        $scope.data = response;

      }).catch(function(err) {
        console.warn('Error getting users: ', err);
      });
  };
  }]);
