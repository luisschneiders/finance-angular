angular.module('MyApp')
  .controller('PeopleEditCtrl', ['$scope', '$auth', '$location', 'PeopleServices', 'DefaultServices', function($scope, $auth, $location, PeopleServices, DefaultServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }
    let data = {
      people: null,
      isSaving: false,
      isNull: false,
      notFound: {
        url: '/all-users',
        title: 'all users',
        message:'Record Not Found!',
      },
      top: {
        title: 'update user',
        url: '/user-new',
        show: true
      },
      typeAction: [],
      messages: {}
    };
    let id = $location.path().substr(6); // to remove /user/
    let people = PeopleServices.getPeopleById(id);

    DefaultServices.setTop(data.top);
    data.typeAction = PeopleServices.getPeopleType();

    people.then(function(response) {
      if (!response) {
        data.isNull = true;
        return;
      }
      data.isNull = false;
      data.people = response;
    }).catch(function(err) {
      console.warn('Error getting user: ', err);
    });

    $scope.savePeople = function($valid) {
      let peopleUpdated;
      if (data.isSaving) {
        return;
      }
      if(!$valid) {
        return;
      }
      data.isSaving = true;
      peopleUpdated = PeopleServices.update(data.people);
      peopleUpdated.then(function(response) {
        data.isSaving = false;
        data.messages = {
          success: [response.data]
        };
      }).catch(function(response) {
        console.warn('Error updating user: ', response);
        data.isSaving = false;
        data.messages = {
          error: Array.isArray(response.data) ? response.data : [response.data]
        };
      });
    };

    $scope.data = data;
  }]);
