angular.module('MyApp')
.factory('BankServices', ['$http', function($http) {
  return {
    getAllBanks: function() {
      let banks = $http.get('/banks')
          .then(function(response){
            return response.data;
          })
          .catch(function(error) {
            return error;
          });
      return banks;
    },
    getBankById: function(id) {
      let bank = $http.get(`/banks/${id}`)
          .then(function(response){
            return response.data;
          })
          .catch(function(error) {
            return error;
          });
      return bank;
    },
    update: function(data) {
      return $http.put(`/banks/${data.id}`, data);
    },
    add: function(data) {
      return $http.post(`/banks/new`, data);
    }
  };
}]);
