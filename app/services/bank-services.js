angular.module('MyApp')
.factory('BankServices', function($http, $rootScope) {
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
    }
  };
});