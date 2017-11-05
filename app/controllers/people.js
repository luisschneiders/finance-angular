angular.module('MyApp')
  .controller('PeopleCtrl', ['$scope', '$auth', '$location', 'PeopleServices', 'DefaultServices', function($scope, $auth, $location, PeopleServices, DefaultServices) {
    if (!$auth.isAuthenticated()) {
      $location.path('/login');
      return;
    }
    let data = {
      people: [],
      isNull: false,
      notFound: {
        url: '/all-users',
        title: 'Users',
        message:'Record Not Found!',
      },
      class: {
        active: 'is-active',
        inactive: 'is-inactive'
      },
      top: {
        title: 'people',
        url: '/user-new',
        show: true
      },
      isLoading: false
    };
    let people = PeopleServices.getAllPeople();

    data.isLoading = true;

    DefaultServices.setTop(data.top);

    people.then(function(response) {
      let top = {};
      if(!response || response.length == 0) {
        data.isNull = true;
        data.isLoading = false;
        return;
      }
      data.people = response;
      top = DefaultServices.getTop();
      data.isLoading = false;
    }).catch(function(err) {
      console.warn('Error getting users: ', err);
    });

    $scope.editPeople = function(id) {
      $location.path(`/user/${id}`);
    };

    $scope.data = data;
  }]);
