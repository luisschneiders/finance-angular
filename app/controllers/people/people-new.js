'use strict';

angular.module('MyApp')
  .controller('PeopleNewCtrl', ['$scope', '$auth', '$location', '$timeout', 'PeopleServices', 'DefaultServices', function($scope, $auth, $location, $timeout, PeopleServices, DefaultServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }
    let data = {
      people: {
        peopleDescription: null,
        peopleRates: null,
        peopleType: null,
        peopleIsActive: 1
      },
      isSaving: false,
      isNull: false, // it's required for the transaction-type-edit.html
      top: {
        title: 'new user',
        url: '/user-new',
        show: true
      },
      typeAction: []
    };

    DefaultServices.setTop(data.top);
    data.typeAction = PeopleServices.getPeopleType();

    $scope.savePeople = function($valid) {
      let peopleUpdated;
      if (data.isSaving) {
        return;
      }
      if(!$valid) {
        return;
      }
      data.isSaving = true;
      peopleUpdated = PeopleServices.add(data.people);
      peopleUpdated.then(function(response) {
        data.isSaving = false;
        data.messages = {
          success: [response.data]
        };
        $timeout(function() {
          $location.path(`/user/${response.data.people.id}`);
        }, 1000);
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
