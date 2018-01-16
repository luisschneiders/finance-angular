angular.module('MyApp')
  .controller('PeopleCtrl', ['$scope', '$auth', '$location', '$filter', '$anchorScroll', 'PeopleServices', 'DefaultServices',
  function($scope, $auth, $location, $filter, $anchorScroll, PeopleServices, DefaultServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }

    $scope.settings = {};
    $scope.data = [];
    $scope.currentPage = 0;
    $scope.pageSize = 12; // TODO: Set Default value in json file

    DefaultServices.getSettings()
      .then(function(response) {
        $scope.settings = response;
        setTop(response);
        getPeople(response);
      }).catch(function(err) {
        console.warn('Error getting settings: ', err);
      });


    $scope.editPeople = function(id) {
      $location.path(`/user/${id}`);
    };

    $scope.getData = function() {
      return $filter('filter')($scope.data);
    };

    $scope.numberOfPages = function() {
      return Math.ceil($scope.getData().length / $scope.pageSize);
    };

    $scope.refreshList = function(pageSize) {
      $scope.pageSize = pageSize;
    };

    $scope.scrollUp = function() {
      $anchorScroll();
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
