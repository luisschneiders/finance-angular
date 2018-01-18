angular.module('MyApp')
.factory('BankServices', ['$http', function($http) {
  return {
    getAllBanks: function(params) {
      let banks = $http.get(`/get-all-banks/page=${params.page}&pageSize=${params.pageSize}`) // TODO: use {cache: true}
          .then(function(response){
            return response.data;
          })
          .catch(function(error) {
            return error;
          });
      return banks;
    },
    getActiveBanks: function() {
      let banks = $http.get(`/get-active-banks`)
          .then(function(response){
            return response.data;
          })
          .catch(function(error) {
            return error;
          });
      return banks;
    },
    getBankById: function(id) {
      let bank = $http.get(`/bank-id=${id}`)
          .then(function(response){
            return response.data;
          })
          .catch(function(error) {
            return error;
          });
      return bank;
    },
    save: function(newRecord, data) {
      if(newRecord) {
        return $http.post(`/bank-new`, data);
      }
      return $http.put(`/bank-id=${data.id}`, data);
    }
  };
}]);
