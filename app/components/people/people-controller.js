angular.module('MyApp')
  .controller('PeopleCtrl', ['$scope', '$auth', '$location', '$filter', '$routeParams', 'DefaultServices', 'PeopleServices',
  function($scope, $auth, $location, $filter, $routeParams, DefaultServices, PeopleServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }

    let page = $routeParams.page;
    let pageSize = $routeParams.pageSize;

    $scope.state = {};
    $scope.settings = {};
    $scope.data = [];
    $scope.currentPage = 0;
    $scope.pagination = {};
    $scope.pageSize = pageSize;
    $scope.state.noSettings = true;

    DefaultServices.getSettings()
      .then(function(response) {
        getPeople();
        $scope.state.isLoading = true;
        $scope.state.noSettings = false;
        $scope.settings = response;
        DefaultServices.setTop(response.people.defaults.top);
      }).catch(function(error) {
        $scope.state.noSettings = true;
        $scope.state.messages = {
          error: Array.isArray(error) ? error : [error]
        };
      });

    $scope.editPeople = function(id) {
      $location.path(`/user=${id}`);
    };

    $scope.previousPage = function() {
      $location.path(`/all-users/page=${$scope.pagination.page - 1}&pageSize=${$scope.pageSize}`);
    };

    $scope.nextPage = function() {
      $location.path(`/all-users/page=${$scope.pagination.page + 1}&pageSize=${$scope.pageSize}`);
    };

    $scope.refreshList = function(pageSize) {
      $location.path(`/all-users/page=${$scope.pagination.page}&pageSize=${pageSize}`);
    };

    function getPeople() {
      let params = {
        page: page,
        pageSize: pageSize
      };
      PeopleServices.getAllPeople(params)
        .then(function(response) {
          $scope.state.isNull = false;
          $scope.state.isLoading = false;
          $scope.data = response.people;
          $scope.pagination = response.pagination;
        }).catch(function(error) {
          $scope.state.isNull = true;
          $scope.state.isLoading = false;
          $scope.state.messages = {
            error: Array.isArray(error) ? error : [error]
          };
        });
    };
  }]);
