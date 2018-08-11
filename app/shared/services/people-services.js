angular.module('MyApp')
.factory('PeopleServices', ['$http', '$q', function($http, $q) {
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
    getAllPeople: function(params) {
      let actions = this.getPeopleType();
      let people = $http.get(`/get-all-people/page=${params.page}&pageSize=${params.pageSize}`) // TODO: use {cache: true}
          .then(function(response){
            _.forEach(response.data.people, function(data) {
              _.find(actions, function(action){
                if (data.peopleType == action.value) {
                  data.peopleTypeDescription = action.description;
                }
              });
            });
            return response.data;
          })
          .catch(function(response) {
            return $q.reject(response.data);
          });
      return people;
    },
    getPeopleById: function(id) {
      let people = $http.get(`/people-id=${id}`)
          .then(function(response){
            return response.data;
          })
          .catch(function(response) {
            return $q.reject(response.data);
          });
      return people;
    },
    save: function(newRecord, data) {
      let people = {};
      if(newRecord) {
        people = $http.post(`/people-new`, data)
          .then(function(response) {
            return response.data;
          }).catch(function(response) {
            return $q.reject(response.data);
          });
      } else {
        people = $http.put(`/people-id=${data.id}`, data)
          .then(function(response) {
            return response.data;
          }).catch(function(response) {
            return $q.reject(response.data);
          });
      }
      return people;
    },
    getPeopleByRole: function(role) {
      console.log('LFS - Role', role);
      let people = $http.get(`/get-people-by-role=${role}`)
          .then(function(response){
            return response.data;
          })
          .catch(function(response) {
            return $q.reject(response.data);
          });
      return people;
    }
  };
}]);
