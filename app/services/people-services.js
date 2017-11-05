angular.module('MyApp')
.factory('PeopleServices', ['$http', function($http) {
  return {
    getPeopleType: function() {
      return actions = [
        {
          value: null,
          description: 'Please select one...',
          selected: true
        },
        {
          value: 1,
          description: 'Employer',
          selected: false
        },
        {
          value: 2,
          description: 'Contractor',
          selected: false
        },
        {
          value: 3,
          description: 'Subcontractor',
          selected: false
        }
      ]
    },
    getAllPeople: function() {
      let actions = this.getPeopleType();
      let people = $http.get('/people')
          .then(function(response){
            _.forEach(response.data, function(data) {
              _.find(actions, function(action){
                if (data.peopleType == action.value) {
                  data.peopleTypeDescription = action.description;
                }
              });
            });
            return response.data;
          })
          .catch(function(error) {
            return error;
          });
      return people;
    },
    getPeopleById: function(id) {
      let people = $http.get(`/people/${id}`)
          .then(function(response){
            return response.data;
          })
          .catch(function(error) {
            return error;
          });
      return people;
    },
    update: function(data) {
      return $http.put(`/people/${data.id}`, data);
    },
    add: function(data) {
      return $http.post(`/people/new`, data);
    }
  };
}]);
